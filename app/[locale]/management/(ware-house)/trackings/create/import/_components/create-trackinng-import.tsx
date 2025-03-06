/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"

import React, { useState, useTransition } from "react"
import { useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { getLocalTimeZone } from "@internationalized/date"
import { format } from "date-fns"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import {
  Dialog,
  DialogContent,
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
import { CurrencyInput } from "@/components/form/currency-input"
import {
  createCalendarDate,
  DateTimePicker,
} from "@/components/form/date-time-picker"
import MultiImageDropzone from "@/components/form/multi-image-dropzone"

function CreateTrackingImportForm() {
  const timezone = getLocalTimeZone()
  const t = useTranslations("TrackingsManagementPage")
  const router = useRouter()
  const locale = useLocale()
  const [isPending, startTransition] = useTransition()

  const [openComboboxSupplier, setOpenComboboxSupplier] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [notImportedDataBase64, setNotImportedDataBase64] = useState<
    string | null
  >(null)
  const [importErrors, setImportErrors] = useState<{
    worksheet: number
    result: { workSheetIndex: number; rowNumber: number; errors: string[] }[]
  } | null>(null)

  const { data: supplierItems } = useSuppliers()

  const form = useForm<TCreateTrackingSchema>({
    resolver: zodResolver(createTrackingSchema),
    defaultValues: {
      totalAmount: 0,
      totalItem: 0,
      coverImageFiles: [],
      previewImages: [],
      scanCoverImage: true,
      scanTitle: true,
      scanItemName: true,
      trackingType: ETrackingType.STOCK_IN,
    },
  })

  const isTransferType = form.watch("trackingType") === ETrackingType.TRANSFER

  const onSubmit = async (values: TCreateTrackingSchema) => {
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
      if (values.scanCoverImage) {
        formData.append("scanningFields", "coverImage")
      }
      if (values.scanTitle) {
        formData.append("scanningFields", "title")
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

      values.coverImageFiles.map((file) => {
        formData.append("coverImageFiles", file)
      })

      const res = await createTracking(formData)

      if (res?.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data.message,
          variant: "success",
        })

        const notImportedDataBase64 = z
          .string()
          .base64()
          .optional()
          .catch(undefined)
          .parse(res.data)

        if (!notImportedDataBase64) {
          router.push("/management/trackings")
          return
        }

        setNotImportedDataBase64(notImportedDataBase64)

        return
      }

      setHasError(true)
      form.setValue("duplicateHandle", EDuplicateHandle.ALLOW)

      //@ts-ignore
      if (Array.isArray(res?.result)) {
        //@ts-ignore
        setImportErrors(res)
      } else {
        setImportErrors(null)
      }

      // handleServerActionError(res, locale, form)
    })
  }

  const handleUploadFile = (
    e: React.ChangeEvent<HTMLInputElement>,
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

  const handleDownload = () => {
    try {
      // Chuyển đổi Base64 sang Blob
      if (!notImportedDataBase64) return
      const byteCharacters = atob(notImportedDataBase64)
      const byteNumbers = new Array(byteCharacters.length)
        .fill(0)
        .map((_, i) => byteCharacters.charCodeAt(i))
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      // Tạo link tải xuống
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "skipped-books.xlsx"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setNotImportedDataBase64(null)
    } catch (error) {
      console.error("Lỗi khi tải file:", error)
    }
  }

  return (
    <>
      {notImportedDataBase64 ? (
        <div className="mt-2">
          <p>{t("There are some library items that have not been imported")}</p>
          <div className="flex items-center justify-end gap-4">
            <Button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setNotImportedDataBase64(null)
                router.push("/management/tracking")
              }}
              variant="outline"
              className="mt-2"
            >
              {t("Cancel")}
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleDownload()
              }}
              className="mt-2"
            >
              {t("Download them")}
            </Button>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("File")} (csv, xlsx, xlsm)
                    <span className="ml-1 text-xl font-bold leading-none text-primary">
                      *
                    </span>
                  </FormLabel>
                  <FormControl>
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
              name="coverImageFiles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("Cover images")}</FormLabel>
                  <FormControl className="flex-1">
                    <MultiImageDropzone
                      files={field.value}
                      setFiles={field.onChange}
                      previews={form.watch("previewImages")}
                      setPreviews={(val) => form.setValue("previewImages", val)}
                      className="max-w-none"
                      wideForm
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
                          <CommandEmpty>{t("No supplier found")}</CommandEmpty>
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
                    <DateTimePicker
                      value={createCalendarDate(field.value)}
                      onChange={(date) =>
                        field.onChange(date ? date.toDate(timezone) : null)
                      }
                    />
                  </FormControl>
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
                            checked={field.value === ETrackingType.STOCK_OUT}
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
                name="expectedReturnDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("Expected return date")}</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={createCalendarDate(field.value)}
                        onChange={(date) =>
                          field.onChange(date ? date.toDate(timezone) : null)
                        }
                      />
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

            <FormField
              control={form.control}
              name="scanTitle"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("Scan title")}</FormLabel>
                    <FormDescription>
                      {t("Scan title description")}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scanCoverImage"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>{t("Scan cover image")}</FormLabel>
                    <FormDescription>
                      {t("Scan cover image description")}
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
              {importErrors?.result && importErrors.result.length > 0 && (
                <Dialog>
                  <DialogTrigger className="w-full text-left text-sm font-semibold">
                    <p className="text-danger">
                      {t("Error while import data")}{" "}
                      <span className="text-secondary-foreground underline">
                        {t("View details")}
                      </span>
                      ({importErrors.result.flatMap((i) => i.errors).length})
                    </p>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("Import errors")}</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[80vh] w-full overflow-y-auto">
                      <Accordion type="multiple" className="w-full">
                        {importErrors.result.map((error, index) => (
                          <AccordionItem
                            key={index}
                            value={`item-${index + 2}`}
                          >
                            <AccordionTrigger className="font-semibold text-danger">
                              {t("Sheet")} {error.workSheetIndex}, {t("Row")}{" "}
                              {error.rowNumber}
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
              <Button
                disabled={isPending}
                variant="outline"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  router.push("/management/trackings")
                }}
              >
                {t("Cancel")}
              </Button>
              <Button disabled={isPending} type="submit">
                {t("Create")}
                {isPending && <Loader2 className="ml-1 size-4 animate-spin" />}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  )
}

export default CreateTrackingImportForm
