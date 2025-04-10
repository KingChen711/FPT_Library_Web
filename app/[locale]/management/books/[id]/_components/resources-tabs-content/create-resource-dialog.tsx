"use client"

import { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { EResourceBookType } from "@/lib/types/enums"
import {
  mutateResourceSchema,
  type TMutateResourceSchema,
} from "@/lib/validations/books/book-editions/mutate-resource"
import { createResource } from "@/actions/books/create-resource"
import useUploadImage from "@/hooks/media/use-upload-image"
import useUploadVideo from "@/hooks/media/use-upload-video"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import AudioDropzone from "@/components/form/audio-dropzone"
import { CurrencyInput } from "@/components/form/currency-input"
import PDFDropzone from "@/components/form/pdf-dropzone"

type Props = {
  bookId: number
}

function CreateResourceDialog({ bookId }: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()

  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  const { mutateAsync: uploadBookImage } = useUploadImage()

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }

  const form = useForm<TMutateResourceSchema>({
    resolver: zodResolver(mutateResourceSchema),
    defaultValues: {
      resourceSize: 0,
    },
  })

  const { mutateAsync: uploadAudioBook } = useUploadVideo()

  const onSubmit = async (values: TMutateResourceSchema) => {
    startTransition(async () => {
      if (values.resourceType === EResourceBookType.AUDIO_BOOK) {
        const data = await uploadAudioBook(values.fileAudioBook)
        if (data) {
          values.resourceUrl = data.secureUrl
          values.providerPublicId = data.publicId
          values.resourceSize = Math.round(values.fileAudioBook.size)
        }
      } else {
        const data = await uploadBookImage(values.fileEbook)
        if (data) {
          values.resourceUrl = data.secureUrl
          values.providerPublicId = data.publicId
          values.resourceSize = Math.round(values.fileEbook.size)
        }
      }

      values.fileEbook = undefined
      values.fileAudioBook = undefined

      const res = await createResource({
        ...values,
        bookId,
      })

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
      <DialogTrigger asChild>
        <Button>
          <Plus />
          {t("Create resource")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>{t("Create resource")}</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="resourceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("Resource type")}
                        <span className="ml-1 text-xl font-bold leading-none text-primary">
                          *
                        </span>
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("Select resource type")}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            EResourceBookType.EBOOK,
                            EResourceBookType.AUDIO_BOOK,
                          ].map((option) => (
                            <SelectItem key={option} value={option}>
                              {t(option)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch("resourceType") && (
                  <>
                    <FormField
                      control={form.control}
                      name={`resourceTitle`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-start">
                          <FormLabel className="flex items-center">
                            {t("Resource title")}
                            <span className="ml-1 text-xl font-bold leading-none text-primary">
                              *
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={isPending}
                              {...field}
                              className="min-w-96 max-w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`borrowPrice`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-start">
                          <FormLabel className="flex items-center">
                            {t("Borrow price")}
                            <span className="ml-1 text-xl font-bold leading-none text-primary">
                              *
                            </span>
                          </FormLabel>
                          <FormControl>
                            <CurrencyInput
                              {...field}
                              disabled={isPending}
                              className="min-w-96 max-w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`defaultBorrowDurationDays`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-start">
                          <FormLabel className="flex items-center">
                            {t("Default borrow duration")}
                            <span className="ml-1 text-xl font-bold leading-none text-primary">
                              *
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={isPending}
                              {...field}
                              type="number"
                              className="min-w-96 max-w-full"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("resourceType") === EResourceBookType.EBOOK && (
                      <FormField
                        control={form.control}
                        name="fileEbook"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              {t("File")}
                              <span className="mb-2 text-lg font-bold leading-none text-primary">
                                *
                              </span>
                            </FormLabel>
                            <FormControl>
                              <PDFDropzone
                                value={field.value}
                                onChange={(val) => {
                                  field.onChange(val)
                                  form.setValue("resourceUrl", undefined)
                                }}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {form.watch("resourceType") ===
                      EResourceBookType.AUDIO_BOOK && (
                      <FormField
                        control={form.control}
                        name="fileAudioBook"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center">
                              {t("File")}
                              <span className="mb-2 text-lg font-bold leading-none text-primary">
                                *
                              </span>
                            </FormLabel>
                            <FormControl>
                              <AudioDropzone
                                value={field.value}
                                onChange={(val) => {
                                  field.onChange(val)
                                  form.setValue("resourceUrl", undefined)
                                }}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </>
                )}

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

export default CreateResourceDialog
