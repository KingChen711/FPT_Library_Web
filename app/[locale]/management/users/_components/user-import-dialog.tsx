"use client"

import { useState, useTransition, type ChangeEvent } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileDown, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import { type ImportError } from "@/lib/types/models"
import {
  userImportSchema,
  type TUserImport,
} from "@/lib/validations/user/user-import"
import { importUser } from "@/actions/users/import-user"
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
import { Separator } from "@/components/ui/separator"

const UserImportDialog = () => {
  const tGeneralManagement = useTranslations("GeneralManagement")

  const [pendingSubmit, startTransition] = useTransition()
  const [open, setOpen] = useState<boolean>(false)
  const [importErrors, setImportErrors] = useState<ImportError[]>([])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<TUserImport>({
    resolver: zodResolver(userImportSchema),
    defaultValues: {
      duplicateHandle: "0",
      isSendEmail: false,
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
    }
  }

  function onSubmit(values: TUserImport) {
    console.log(values)
    startTransition(async () => {
      const formData = new FormData()
      if (values.file) {
        formData.append("file", values.file)
      }
      formData.append("duplicateHandle", values.duplicateHandle)
      formData.append("isSendEmail", values.isSendEmail.toString())

      const res = await importUser(formData)
      if (res.isSuccess) {
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
        <DialogContent className="m-0 overflow-hidden p-0">
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
              </div>

              <div className="space-y-4 p-4">
                <Label>{tGeneralManagement("duplicate control")}</Label>
                <Separator />

                <FormField
                  control={form.control}
                  name="isSendEmail"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-4">
                      <FormLabel className="w-1/3">
                        {tGeneralManagement("scanning")}
                      </FormLabel>
                      <FormControl className="flex-1">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="isSendEmail"
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                field.onChange(checked)
                              }
                            />
                            <Label
                              htmlFor="isSendEmail"
                              className="font-normal"
                            >
                              {tGeneralManagement("fields.isSendEmail")}
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
                            <RadioGroupItem value="0" id="option-one" />
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

                <div className="flex justify-end gap-4">
                  <Button type="submit">
                    {tGeneralManagement("btn.import")}
                    {pendingSubmit && (
                      <Loader2 className="ml-1 size-4 animate-spin" />
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => handleCancel()}>
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

export default UserImportDialog
