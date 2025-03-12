"use client"

import React, { useState, useTransition, type ChangeEvent } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileDown, Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { EDuplicateHandle, EDuplicateHandleToIndex } from "@/lib/types/enums"
import {
  importLibraryItemsSchema,
  type TImportLibraryItemsSchema,
} from "@/lib/validations/books/import-library-items"
import { importLibraryItems } from "@/actions/books/import-library-items"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import MultiImageDropzone from "@/components/form/multi-image-dropzone"

function ImportDialog() {
  const [open, setOpen] = useState(false)
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()
  const [pendingSubmit, startTransition] = useTransition()
  const [importErrors, setImportErrors] = useState<
    { rowNumber: number; errors: string[] }[]
  >([])

  const [notImportedDataBase64, setNotImportedDataBase64] = useState<
    string | null
  >(null)

  const form = useForm<TImportLibraryItemsSchema>({
    resolver: zodResolver(importLibraryItemsSchema),
    defaultValues: {
      coverImageFiles: [],
      previewImages: [],
      scanCoverImage: false,
      scanTitle: false,
    },
  })

  const [hasError, setHasError] = useState(false)

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

  function onSubmit(values: TImportLibraryItemsSchema) {
    startTransition(async () => {
      const formData = new FormData()
      if (values.file) {
        formData.append("file", values.file)
      }
      if (values.scanTitle) {
        formData.append("scanningFields", "title")
      }
      if (values.scanCoverImage) {
        formData.append("scanningFields", "coverImage")
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

      const res = await importLibraryItems(formData)
      if (res?.isSuccess) {
        form.reset()
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
          setOpen(false)
          return
        }

        setNotImportedDataBase64(notImportedDataBase64)
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileDown size={16} /> {t("Import")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>{t("Import books")}</DialogTitle>
          <DialogDescription>
            {notImportedDataBase64 ? (
              <div className="mt-2">
                <p>
                  {t(
                    "There are some library items that have not been imported"
                  )}
                </p>
                <div className="flex items-center justify-end gap-4">
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setNotImportedDataBase64(null)
                      setOpen(false)
                    }}
                    variant="outline"
                    className="mt-2"
                  >
                    {t("Ignore")}
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleDownload()
                      setOpen(false)
                    }}
                    className="mt-2"
                  >
                    {t("Download them")}
                  </Button>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("File")} (csv, xlsx, xlsm)</FormLabel>
                        <FormControl className="flex-1">
                          <Input
                            type="file"
                            placeholder={t("placeholder.file")}
                            accept=".csv, .xlsx, .xlsm"
                            onChange={(e) =>
                              handleUploadFile(e, field.onChange)
                            }
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
                            setPreviews={(val) =>
                              form.setValue("previewImages", val)
                            }
                          />
                        </FormControl>
                        <FormMessage />
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
                                  <Label
                                    className="font-normal"
                                    htmlFor={option}
                                  >
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
                    <Button disabled={pendingSubmit} type="submit">
                      {t("Import")}
                      {pendingSubmit && (
                        <Loader2 className="ml-1 size-4 animate-spin" />
                      )}
                    </Button>
                    <Button
                      disabled={pendingSubmit}
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
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default ImportDialog
