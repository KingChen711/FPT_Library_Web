"use client"

import { useState, useTransition, type ChangeEvent } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileDown, Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import {
  employeeImportSchema,
  type TEmployeeImport,
} from "@/lib/validations/employee/employee-import"
import { importEmployee } from "@/actions/employees/import-employee"
import { toast } from "@/hooks/use-toast"
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

const EmployeeDialogImport = () => {
  const t = useTranslations("UserManagement.UserDialogImport")
  const tUserManagement = useTranslations("UserManagement")
  const locale = useLocale()

  const [pendingSubmit, startTransition] = useTransition()
  const [open, setOpen] = useState<boolean>(false)
  const [isCSV, setIsCSV] = useState<boolean>(false)
  const [hasEmailChecked, setHasEmailChecked] = useState<boolean>(false)

  const form = useForm<TEmployeeImport>({
    resolver: zodResolver(employeeImportSchema),
    defaultValues: {
      duplicateHandle: "0",
      columnSeparator: null,
      encodingType: null,
      scanningFields: [],
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
    if (file) {
      fieldChange(file)
      form.setValue("file", file)

      const fileType = file.name.split(".").pop()?.toLowerCase()
      setIsCSV(fileType === "csv")
      if (fileType === "xlsx") {
        form.setValue("columnSeparator", null)
        form.setValue("encodingType", null)
      }
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

  function onSubmit(values: TEmployeeImport) {
    console.log(values)
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

      const res = await importEmployee(formData)
      if (res.isSuccess) {
        toast({
          title: t("importSuccess"),
          description: "Import successfully",
          variant: "success",
        })
        setOpen(false)
        return
      }
      handleServerActionError(res, locale, form)
    })
  }

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <Button asChild variant="outline" className="bg-primary-foreground">
          <DialogTrigger>
            <FileDown size={16} /> {t("importBtn")}
          </DialogTrigger>
        </Button>
        <DialogContent className="m-0 overflow-hidden p-0">
          <DialogHeader className="w-full space-y-4 bg-primary p-4">
            <DialogTitle className="text-center text-primary-foreground">
              {t("title")}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4 p-4">
                <Label>{t("importSettings")}</Label>
                <Separator />

                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel className="w-1/3">
                        {t("file")} (csv, xlsx)
                      </FormLabel>
                      <FormControl className="flex-1">
                        <Input
                          type="file"
                          placeholder="Import file"
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
                            {t("encodingType")}
                          </FormLabel>
                          <FormControl className="flex-1">
                            <Select
                              {...field}
                              value={field.value || undefined}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue
                                  placeholder={t(
                                    "SelectEncodingType.placeholder"
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
                            Column Separator
                          </FormLabel>
                          <FormControl className="flex-1">
                            <Select
                              {...field}
                              value={field.value || undefined}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="flex-1">
                                <SelectValue
                                  placeholder={t(
                                    "SelectColumnSeparator.placeholder"
                                  )}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value=",">
                                  {t("SelectColumnSeparator.comma")} (,)
                                </SelectItem>
                                <SelectItem value=".">
                                  {t("SelectColumnSeparator.dot")} (.)
                                </SelectItem>
                                <SelectItem value="@">
                                  {t("SelectColumnSeparator.art")} (@)
                                </SelectItem>
                                <SelectItem value="!">
                                  {t("SelectColumnSeparator.exclamation")} (!)
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

              {/* Remaining form fields */}
              <div className="space-y-4 p-4">
                <Label>{t("duplicateControl")}</Label>
                <Separator />

                <FormField
                  control={form.control}
                  name="scanningFields"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel className="w-1/3">{t("scanning")}</FormLabel>
                      <FormControl className="flex-1">
                        <div className="flex items-center gap-4">
                          {/* Email Checkbox */}
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="email"
                              checked={field.value?.includes("email")}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(
                                  checked,
                                  "email",
                                  field.value || [],
                                  field.onChange
                                )
                              }
                            />
                            <Label htmlFor="email" className="font-normal">
                              {tUserManagement("email")}
                            </Label>
                          </div>

                          {/* Phone Checkbox */}
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="phone"
                              checked={field.value?.includes("phone")}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(
                                  checked,
                                  "phone",
                                  field.value || [],
                                  field.onChange
                                )
                              }
                            />
                            <Label htmlFor="phone" className="font-normal">
                              {tUserManagement("phone")}
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
                      <FormLabel className="w-1/3">Duplicate Handle</FormLabel>
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
                              Allow
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="option-two" />
                            <Label className="font-normal" htmlFor="option-two">
                              Replace
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="2" id="option-three" />
                            <Label
                              className="font-normal"
                              htmlFor="option-three"
                            >
                              Skip
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4">
                  <Button type="submit">
                    {t("import")}{" "}
                    {pendingSubmit && (
                      <Loader2 className="ml-1 size-4 animate-spin" />
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => handleCancel()}>
                    {t("cancel")}
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

export default EmployeeDialogImport
