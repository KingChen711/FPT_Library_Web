"use client"

import React, { useState, useTransition, type ChangeEvent } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import {
  EDuplicateHandle,
  EDuplicateHandleToIndex,
  ETrackingType,
} from "@/lib/types/enums"
import { cn } from "@/lib/utils"
import {
  createTrackingSchema,
  type TCreateTrackingSchema,
} from "@/lib/validations/trackings/create-tracking"
import { createTracking } from "@/actions/trackings/create-tracking"
import useSuppliers from "@/hooks/suppliers/use-suppliers"
import { toast } from "@/hooks/use-toast"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { CurrencyInput } from "@/components/ui/currency-input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"

function CreateTrackingDialog() {
  const t = useTranslations("TrackingsManagementPage")
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [hasError, setHasError] = useState(false)
  const [importErrors, setImportErrors] = useState<
    { rowNumber: number; errors: string[] }[]
  >([])
  const [openComboboxSupplier, setOpenComboboxSupplier] = useState(false)
  const { data: supplierItems } = useSuppliers()

  const form = useForm<TCreateTrackingSchema>({
    resolver: zodResolver(createTrackingSchema),
    defaultValues: {
      trackingType: ETrackingType.STOCK_IN,
      scanItemName: true,
      entryDate: "",
    },
  })

  const isTransferType = form.watch("trackingType") === ETrackingType.TRANSFER

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }

  function onSubmit(values: TCreateTrackingSchema) {
    startTransition(async () => {
      const formData = new FormData()
      if (values.file) {
        formData.append("file", values.file)
      }
      formData.append("totalItem", values.totalItem.toString())
      formData.append("supplierId", values.supplierId.toString())
      formData.append("totalAmount", values.totalAmount.toString())
      formData.append("trackingType", values.trackingType.toString())
      formData.append(
        "entryDate",
        format(new Date(values.entryDate), "yyyy-MM-dd")
      )

      if (values.scanItemName) {
        formData.append("scanningFields", "itemName")
      }
      if (values.transferLocation) {
        formData.append("transferLocation", values.transferLocation)
      }
      if (values.description) {
        formData.append("description", values.description)
      }
      if (values.expectedReturnDate) {
        formData.append(
          "expectedReturnDate",
          format(new Date(values.expectedReturnDate), "yyyy-MM-dd")
        )
      }

      if (values.duplicateHandle) {
        formData.append(
          "duplicateHandle",
          EDuplicateHandleToIndex.get(values.duplicateHandle) + ""
        )
      }

      const res = await createTracking(formData)
      if (res?.isSuccess) {
        form.reset()
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data.message,
          variant: "success",
        })
        setOpen(false)
        return
      }

      setHasError(true)
      form.setValue("duplicateHandle", EDuplicateHandle.ALLOW)

      if (Array.isArray(res)) {
        setImportErrors(res)
      } else {
        setImportErrors([])
      }
    })
  }

  const handleUploadFile = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (file: File) => void
  ) => {
    const file = e.target.files?.[0]
    if (
      file &&
      [
        "text/csv",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel.sheet.macroEnabled.12",
      ].includes(file.type)
    ) {
      fieldChange(file)
      form.setValue("file", file)
    } else {
      toast({
        title: locale === "vi" ? "Lỗi" : "Error",
        description:
          locale === "vi"
            ? "Chỉ chấp nhận các tệp csv, xlsx, xlsm"
            : "Only csv, xlsx, xlsm files are accepted",
        variant: "warning",
      })
    }
  }

  const handleCancel = () => {
    form.reset()
    form.clearErrors()
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center justify-end gap-x-1 leading-none">
          <Plus />
          <div>{t("Create tracking")}</div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>{t("Create warehouse tracking")}</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel className="w-1/3">
                        {t("File")} (csv, xlsx, xlsm)
                        <span className="ml-1 text-xl font-bold leading-none text-primary">
                          *
                        </span>
                      </FormLabel>
                      <FormControl className="flex-1">
                        <Input
                          type="file"
                          accept=".csv, .xlsx"
                          onChange={(e) => handleUploadFile(e, field.onChange)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem
                                checked={field.value === ETrackingType.TRANSFER}
                                value={ETrackingType.TRANSFER.toString()}
                              />
                            </FormControl>
                            <FormLabel className="cursor-pointer font-normal">
                              {t("Transfer")}
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

                <FormField
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
                />

                {isTransferType && (
                  <FormField
                    control={form.control}
                    name="expectedReturnDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Expected return date")}</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {isTransferType && (
                  <FormField
                    control={form.control}
                    name="transferLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Transfer location")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {isTransferType && (
                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Reason")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

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

                <FormField
                  control={form.control}
                  name="scanItemName"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>{t("Scan item name")}</FormLabel>
                        <FormDescription>
                          {t("Scan item name description")}
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {hasError && (
                  <FormField
                    control={form.control}
                    name="duplicateHandle"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <FormLabel>{t("Duplicate handle")}</FormLabel>
                        <FormControl className="flex-1">
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="flex items-center gap-4"
                          >
                            {Object.values(EDuplicateHandle).map((option) => (
                              <div
                                key={option}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem value={option} id={option} />
                                <Label className="font-normal" htmlFor={option}>
                                  {t(option)}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <div>
                  {importErrors.length > 0 && (
                    <Dialog>
                      <DialogTrigger className="w-full text-left text-sm font-semibold">
                        <p className="text-danger">
                          {t("Error while import data")}{" "}
                          <span className="text-secondary-foreground underline">
                            {t("View details")}
                          </span>
                          ({importErrors.flatMap((i) => i.errors).length})
                        </p>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t("Import errors")}</DialogTitle>
                        </DialogHeader>
                        <div className="max-h-[80vh] w-full overflow-y-auto">
                          <Accordion type="multiple" className="w-full">
                            {importErrors?.map((error, index) => (
                              <AccordionItem
                                key={index}
                                value={`item-${index + 2}`}
                              >
                                <AccordionTrigger className="font-semibold text-danger">
                                  {t("Row")} {error.rowNumber}
                                </AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-2">
                                  {error.errors.map((e, i) => (
                                    <p key={i}>{e}</p>
                                  ))}
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                <div className="flex justify-end gap-4">
                  <Button disabled={isPending} type="submit">
                    {t("Create")}
                    {isPending && (
                      <Loader2 className="ml-1 size-4 animate-spin" />
                    )}
                  </Button>
                  <Button
                    disabled={isPending}
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleCancel()
                    }}
                  >
                    {t("Cancel")}
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

export default CreateTrackingDialog
