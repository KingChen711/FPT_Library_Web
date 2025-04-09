"use client"

import React, { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { ETrackingType } from "@/lib/types/enums"
import { type Supplier, type Tracking } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import {
  editTrackingSchema,
  type TEditTrackingSchema,
} from "@/lib/validations/trackings/edit-tracking"
import { updateTracking } from "@/actions/trackings/update-tracking"
import useSuppliers from "@/hooks/suppliers/use-suppliers"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { CurrencyInput } from "@/components/form/currency-input"

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
  tracking: Tracking & {
    supplier: Supplier
  }
}

function EditTrackingDialog({ open, setOpen, tracking }: Props) {
  const t = useTranslations("TrackingsManagementPage")
  const locale = useLocale()

  const [isPending, startTransition] = useTransition()

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }

  const form = useForm<TEditTrackingSchema>({
    resolver: zodResolver(editTrackingSchema),
    defaultValues: {
      supplierId: tracking.supplierId,
      totalItem: tracking.totalItem,
      totalAmount: tracking.totalAmount,
      trackingType: tracking.trackingType,
      transferLocation: tracking.transferLocation || undefined,
      description: tracking.description || undefined,
      entryDate: tracking.entryDate,
      expectedReturnDate: tracking.expectedReturnDate || undefined,
    },
  })

  const [openComboboxSupplier, setOpenComboboxSupplier] = useState(false)
  const { data: supplierItems } = useSuppliers()

  const onSubmit = async (values: TEditTrackingSchema) => {
    startTransition(async () => {
      const res = await updateTracking(tracking.trackingId, values)
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
          <DialogTitle>{t("Edit tracking")}</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="supplierId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        {t("Supplier")}
                        <span className="ml-1 text-xl font-bold leading-none text-primary">
                          *
                        </span>
                      </FormLabel>
                      <Popover
                        open={openComboboxSupplier}
                        onOpenChange={setOpenComboboxSupplier}
                      >
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? supplierItems?.find(
                                    (supplier) =>
                                      supplier.supplierId === field.value
                                  )?.supplierName
                                : t("Select supplier")}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Command>
                            <CommandInput
                              placeholder={t("Search supplier")}
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>
                                {t("No supplier found")}
                              </CommandEmpty>
                              <CommandGroup>
                                {supplierItems?.map((supplier) => (
                                  <CommandItem
                                    value={supplier.supplierName}
                                    key={supplier.supplierId}
                                    onSelect={() => {
                                      form.setValue(
                                        "supplierId",
                                        supplier.supplierId
                                      )
                                      setOpenComboboxSupplier(false)
                                    }}
                                  >
                                    {supplier.supplierName}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        supplier.supplierId === field.value
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
                  name="trackingType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>
                        {t("Tracking type")}
                        <span className="ml-1 text-xl font-bold leading-none text-primary">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(val) => field.onChange(+val)}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                checked={field.value === ETrackingType.STOCK_IN}
                                value={ETrackingType.STOCK_IN.toString()}
                              />
                            </FormControl>
                            <FormLabel className="cursor-pointer font-normal">
                              {t("Stock in")}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                checked={
                                  field.value === ETrackingType.STOCK_OUT
                                }
                                value={ETrackingType.STOCK_OUT.toString()}
                              />
                            </FormControl>
                            <FormLabel className="cursor-pointer font-normal">
                              {t("Stock out")}
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="totalItem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("Total item")}
                        <span className="ml-1 text-xl font-bold leading-none text-primary">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
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
                        {t("Total amount")}{" "}
                        <span className="ml-1 text-xl font-bold leading-none text-primary">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <CurrencyInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="entryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("Entry date")}
                        <span className="ml-1 text-xl font-bold leading-none text-primary">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Input {...field} type="date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <FormField
                  control={form.control}
                  name="entryDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t("Entry date")}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto size-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Description")}</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
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
                    {t("Save")}{" "}
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

export default EditTrackingDialog
