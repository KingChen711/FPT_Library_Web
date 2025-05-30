"use client"

import React, { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { EBookCopyConditionStatus } from "@/lib/types/enums"
import { type Category, type TrackingDetail } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import {
  editTrackingDetailSchema,
  type TEditTrackingDetailSchema,
} from "@/lib/validations/trackings/edit-tracking-detail"
import { updateTrackingDetail } from "@/actions/trackings/edit-tracking-detail"
import useCategories from "@/hooks/categories/use-categories"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CurrencyInput } from "@/components/form/currency-input"

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
  trackingDetail: TrackingDetail
}

function EditTrackingDetailDialog({ open, setOpen, trackingDetail }: Props) {
  const t = useTranslations("TrackingsManagementPage")

  const locale = useLocale()

  const [isPending, startTransition] = useTransition()

  const { data: categoryItems } = useCategories()
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  )

  //TODO(isNotBook)
  const isNotBook =
    selectedCategory?.englishName === "Magazine" ||
    selectedCategory?.englishName === "ChildrenBook" ||
    selectedCategory?.englishName === "Newspaper" ||
    selectedCategory?.englishName === "Other" ||
    false

  const [openComboboxCategory, setOpenComboboxCategory] = useState(false)

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }

  const form = useForm<TEditTrackingDetailSchema>({
    resolver: zodResolver(editTrackingDetailSchema),
    defaultValues: {
      categoryId: trackingDetail.categoryId,
      isbn: trackingDetail.isbn || undefined,
      itemName: trackingDetail.itemName,
      itemTotal: trackingDetail.itemTotal,
      totalAmount: trackingDetail.totalAmount,
      unitPrice: trackingDetail.unitPrice,
      conditionId: trackingDetail.conditionId,
      stockTransactionType: trackingDetail.stockTransactionType,
    },
  })

  const onSubmit = async (values: TEditTrackingDetailSchema) => {
    if (!isNotBook && !values.isbn) {
      form.setError("isbn", { message: "required" })
      return
    }

    startTransition(async () => {
      const res = await updateTrackingDetail(
        trackingDetail.trackingId,
        trackingDetail.trackingDetailId,
        values
      )
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setOpen(false)
        return
      }
      handleServerActionError(res, locale, form)
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[80vh] w-full max-w-2xl overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>{t("Edit detail")}</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 space-y-6"
              >
                {/* <FormField
                  control={form.control}
                  name="stockTransactionType"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>
                        {t("Stock transaction type")}
                        <span className="ml-1 text-xl font-bold leading-none text-primary">
                          *
                        </span>
                      </FormLabel>
                      <Select
                        onValueChange={(val) => field.onChange(+val)}
                        value={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("Select gender")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(EStockTransactionType)
                            .filter((e) => typeof e === "number")
                            .map((option) => (
                              <SelectItem
                                key={option}
                                value={option.toString()}
                              >
                                {tStockType(option.toString())}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t("Category")}</FormLabel>
                      <Popover
                        open={openComboboxCategory}
                        onOpenChange={setOpenComboboxCategory}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              disabled
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[200px] justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? locale === "vi"
                                  ? categoryItems?.find(
                                      (category) =>
                                        category.categoryId === field.value
                                    )?.vietnameseName
                                  : categoryItems?.find(
                                      (category) =>
                                        category.categoryId === field.value
                                    )?.englishName
                                : t("Select category")}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Command>
                            <CommandInput
                              placeholder={t("Search category")}
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>
                                {t("No category found")}
                              </CommandEmpty>
                              <CommandGroup>
                                {categoryItems?.map((category) => (
                                  <CommandItem
                                    value={
                                      locale === "vi"
                                        ? category.vietnameseName
                                        : category.englishName
                                    }
                                    key={category.categoryId}
                                    onSelect={() => {
                                      form.setValue(
                                        "categoryId",
                                        category.categoryId
                                      )
                                      form.clearErrors("categoryId")
                                      setSelectedCategory(category)
                                      setOpenComboboxCategory(false)
                                    }}
                                  >
                                    {locale === "vi"
                                      ? category.vietnameseName
                                      : category.englishName}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        category.categoryId === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="itemName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("Item name")}
                        <span className="ml-1 text-xl font-bold leading-none text-primary">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="itemTotal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("Total item")}
                        <span className="ml-1 text-xl font-bold leading-none text-primary">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isPending} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!isNotBook && (
                  <FormField
                    control={form.control}
                    name="isbn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          ISBN{" "}
                          <span className="ml-1 text-xl font-bold leading-none text-primary">
                            *
                          </span>
                        </FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isPending} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="unitPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("Unit price")}
                        <span className="ml-1 text-xl font-bold leading-none text-primary">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <CurrencyInput
                          {...field}
                          disabled={isPending}
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("Total amount")}
                        <span className="ml-1 text-xl font-bold leading-none text-primary">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <CurrencyInput
                          {...field}
                          disabled={isPending}
                          type="number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="conditionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("Condition")}
                        <span className="ml-1 text-xl font-bold leading-none text-primary">
                          *
                        </span>
                      </FormLabel>
                      <Select
                        onValueChange={(val) => field.onChange(+val)}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">
                            {t(EBookCopyConditionStatus.GOOD)}
                          </SelectItem>
                          <SelectItem value="3">
                            {t(EBookCopyConditionStatus.DAMAGED)}
                          </SelectItem>
                          <SelectItem value="2">
                            {t(EBookCopyConditionStatus.WORN)}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-x-4">
                  <DialogClose asChild>
                    <Button
                      disabled={isPending}
                      variant="secondary"
                      className="float-right mt-4"
                    >
                      {t("Cancel")}
                    </Button>
                  </DialogClose>

                  <Button
                    disabled={isPending}
                    type="submit"
                    className="float-right mt-4"
                  >
                    {t("Save")}
                    {isPending && (
                      <Loader2 className="ml-1 size-4 animate-spin" />
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default EditTrackingDetailDialog
