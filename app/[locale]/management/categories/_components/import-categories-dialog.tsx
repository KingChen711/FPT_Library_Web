"use client"

import { useState, useTransition, type ChangeEvent } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileDown, Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { EDuplicateHandle, EDuplicateHandleToIndex } from "@/lib/types/enums"
import {
  importCategoriesSchema,
  type TImportCategories,
} from "@/lib/validations/categories/import-categories"
import { importCategories } from "@/actions/categories/import-categories"
import { toast } from "@/hooks/use-toast"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const ImportCategoriesDialog = () => {
  const t = useTranslations("CategoriesManagementPage")

  const locale = useLocale()
  const [pendingSubmit, startTransition] = useTransition()
  const [open, setOpen] = useState(false)
  const [importErrors, setImportErrors] = useState<
    { row: number; errMsg: string }[]
  >([])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<TImportCategories>({
    resolver: zodResolver(importCategoriesSchema),
    defaultValues: {
      duplicateHandle: EDuplicateHandle.ALLOW,
    },
  })

  const handleCancel = () => {
    form.reset()
    form.clearErrors()
    setOpen(false)
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

  function onSubmit(values: TImportCategories) {
    startTransition(async () => {
      const formData = new FormData()
      if (values.file) {
        formData.append("file", values.file)
      }
      formData.append(
        "duplicateHandle",
        EDuplicateHandleToIndex.get(values.duplicateHandle) + ""
      )

      const res = await importCategories(formData)
      if (res?.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setOpen(false)
        return
      }

      if (Array.isArray(res)) {
        setImportErrors(res)
      } else {
        setImportErrors([])
      }
    })
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <FileDown size={16} /> {t("Import")}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] overflow-y-auto overflow-x-hidden">
          <DialogHeader>
            <DialogTitle>{t("Import categories")}</DialogTitle>

            <DialogDescription>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <FormLabel className="w-1/3">
                          {t("File")} (csv, xlsx, xlsm)
                        </FormLabel>
                        <FormControl className="flex-1">
                          <Input
                            type="file"
                            placeholder={t("placeholder.file")}
                            accept=".csv, .xlsx"
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
                    name="duplicateHandle"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4">
                        <FormLabel className="w-1/3">
                          {t("Duplicate handle")}
                        </FormLabel>
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

                  <div>
                    {importErrors.length > 0 && (
                      <Dialog>
                        <DialogTrigger className="w-full text-left text-sm font-semibold">
                          <p className="text-danger">
                            {t("Error while import data")}{" "}
                            <span className="text-secondary-foreground underline">
                              {t("View details")}
                            </span>
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
                                    {t("Row")}
                                    {error.row}
                                  </AccordionTrigger>
                                  <AccordionContent className="flex flex-col gap-2">
                                    <p>{error.errMsg}</p>
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
                      onClick={() => handleCancel()}
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
    </div>
  )
}

export default ImportCategoriesDialog
