"use client"

import { useEffect, useState, useTransition, type ChangeEvent } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileDown, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { type ImportError } from "@/lib/types/models"
import {
  authorImportSchema,
  type TAuthorImport,
} from "@/lib/validations/author/author-import"
import { importAuthor } from "@/actions/authors/import-author"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

const AuthorImportDialog = () => {
  const tGeneralManagement = useTranslations("GeneralManagement")
  const [importErrors, setImportErrors] = useState<ImportError[]>([])
  const [pendingSubmit, startTransition] = useTransition()
  const [open, setOpen] = useState<boolean>(false)
  const [isCSV, setIsCSV] = useState<boolean>(false)
  const [hasEmailChecked, setHasEmailChecked] = useState<boolean>(false)

  const form = useForm<TAuthorImport>({
    resolver: zodResolver(authorImportSchema),
    defaultValues: {
      duplicateHandle: "0",
      columnSeparator: null,
      encodingType: null,
      scanningFields: [],
    },
  })

  useEffect(() => {
    setImportErrors([])
  }, [open])

  const handleCancel = () => {
    form.reset()
    form.clearErrors()
    setImportErrors([])
    setOpen(false)
  }

  const handleUploadFile = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (file: File) => void
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      fieldChange(file)
      form.setValue("file", file)

      const fileType = file.name.split(".").pop()?.toLowerCase()
      setIsCSV(fileType === "csv")
      if (fileType === "xlsx") {
        form.setValue("columnSeparator", null)
        form.setValue("encodingType", null)
      }
      setImportErrors([])
    }
  }

  const handleCheckboxChange = (
    checked: boolean | string,
    value: string,
    currentValues: string[],
    onChange: (values: string[]) => void
  ) => {
    const updatedValues = checked
      ? [...currentValues, value]
      : currentValues.filter((item) => item !== value)
    onChange(updatedValues)

    if (value === "email") {
      setHasEmailChecked(checked as boolean)
    }
  }

  function onSubmit(values: TAuthorImport) {
    console.log("🚀 ~ onSubmit ~ values:", values)
    startTransition(async () => {
      const formData = new FormData()
      if (values.file) {
        formData.append("file", values.file)
      }

      formData.append("duplicateHandle", values.duplicateHandle)

      if (values.columnSeparator) {
        formData.append("columnSeparator", values.columnSeparator)
      }

      if (values.encodingType) {
        formData.append("encodingType", values.encodingType)
      }

      values.scanningFields.forEach((field) => {
        formData.append("scanningFields", field)
      })

      const res = await importAuthor(formData)
      console.log("🚀 ~ startTransition ~ res:", res)

      if (res.isSuccess) {
        console.log("helloooooo")
        toast({
          title: tGeneralManagement("btn.import"),
          description: "Import successfully",
          variant: "success",
        })
        setOpen(false)
        return
      } else if (Array.isArray(res)) {
        setImportErrors(res as ImportError[])
      } else {
        setImportErrors([])
      }
    })
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <Button asChild variant="outline">
          <DialogTrigger>
            <FileDown size={16} /> {tGeneralManagement("btn.import")}
          </DialogTrigger>
        </Button>
        <DialogContent className="m-0 max-h-[80vh] overflow-y-auto p-0">
          <DialogHeader className="w-full space-y-4 bg-primary p-4">
            <DialogTitle className="text-center text-primary-foreground">
              {tGeneralManagement("btn.import")}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4 p-4">
                <div>
                  {importErrors.length > 0 && (
                    <Dialog>
                      <DialogTrigger className="w-full text-left text-sm font-semibold">
                        <p className="text-danger">
                          Invoke errors while import data &nbsp;
                          <span className="text-secondary-foreground underline">
                            view detail
                          </span>
                        </p>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Import Errors</DialogTitle>
                        </DialogHeader>
                        <div className="max-h-[80vh] w-full overflow-y-auto">
                          <Accordion type="multiple" className="w-full p-4">
                            {importErrors.map((error, index) => (
                              <AccordionItem
                                key={index}
                                value={`item-${index + 2}`}
                              >
                                <AccordionTrigger className="font-semibold text-danger">
                                  Row: {error.rowNumber}
                                </AccordionTrigger>
                                <AccordionContent className="flex flex-col gap-2">
                                  {error.errors.map((err, index) => (
                                    <p key={index}>{err}</p>
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

                <Label>{tGeneralManagement("setting")}</Label>
                <Separator />

                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel className="w-1/3">
                        {tGeneralManagement("file")} (csv, xlsx, xlsm)
                      </FormLabel>
                      <FormControl className="flex-1">
                        <Input
                          type="file"
                          placeholder={tGeneralManagement("placeholder.file")}
                          accept=".csv, .xlsx"
                          onChange={(e) => handleUploadFile(e, field.onChange)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {isCSV && (
                  <>
                    <FormField
                      control={form.control}
                      name="encodingType"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-4">
                          <FormLabel className="w-1/3">
                            {tGeneralManagement("encoding type")}
                          </FormLabel>
                          <FormControl className="flex-1">
                            <Select
                              {...field}
                              value={field.value || undefined}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue
                                  placeholder={tGeneralManagement(
                                    "placeholder.encoding type"
                                  )}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="UTF-8">UTF-8</SelectItem>
                                <SelectItem value="ASCII">ASCII</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="columnSeparator"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-4">
                          <FormLabel className="w-1/3">
                            {tGeneralManagement("column separator")}
                          </FormLabel>
                          <FormControl className="flex-1">
                            <Select
                              {...field}
                              value={field.value || undefined}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue
                                  placeholder={tGeneralManagement(
                                    "placeholder.column separator"
                                  )}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value=",">
                                  {tGeneralManagement("mark.comma")}
                                  (,)
                                </SelectItem>
                                <SelectItem value=".">
                                  {tGeneralManagement("mark.dot")}
                                  (.)
                                </SelectItem>
                                <SelectItem value="@">
                                  {tGeneralManagement("mark.art")}
                                  (@)
                                </SelectItem>
                                <SelectItem value="!">
                                  {tGeneralManagement("mark.exclamation")}
                                  (!)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>

              <div className="space-y-4 p-4">
                <Label>{tGeneralManagement("duplicate control")}</Label>
                <Separator />
                <FormField
                  control={form.control}
                  name="scanningFields"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel className="w-1/3">
                        {tGeneralManagement("scanning")}
                      </FormLabel>
                      <FormControl className="flex-1">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="authorCode"
                              checked={field.value?.includes("authorCode")}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(
                                  checked,
                                  "authorCode",
                                  field.value || [],
                                  field.onChange
                                )
                              }
                            />
                            <Label htmlFor="authorCode" className="font-normal">
                              {tGeneralManagement("fields.authorCode")}
                            </Label>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duplicateHandle"
                  render={({}) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel className="w-1/3">
                        {tGeneralManagement("duplicate handle")}
                      </FormLabel>
                      <FormControl className="flex-1">
                        <RadioGroup
                          defaultValue="0"
                          className="flex items-center gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="0"
                              id="option-one"
                              disabled={hasEmailChecked}
                            />
                            <Label className="font-normal" htmlFor="option-one">
                              {tGeneralManagement("allow")}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="option-two" />
                            <Label className="font-normal" htmlFor="option-two">
                              {tGeneralManagement("replace")}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="2" id="option-three" />
                            <Label
                              className="font-normal"
                              htmlFor="option-three"
                            >
                              {tGeneralManagement("skip")}
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-end gap-4">
                  <Button type="submit" disabled={pendingSubmit}>
                    {tGeneralManagement("btn.import")}
                    {pendingSubmit && (
                      <Loader2 className="ml-1 size-4 animate-spin" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    disabled={pendingSubmit}
                    onClick={() => handleCancel()}
                  >
                    {tGeneralManagement("btn.cancel")}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AuthorImportDialog
