"use client"

import { useEffect, useState, useTransition } from "react"
import { NOT_CLOUDINARY_URL } from "@/constants"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { EResourceBookType } from "@/lib/types/enums"
import { type BookResource } from "@/lib/types/models"
import {
  mutateResourceSchema,
  type TMutateResourceSchema,
} from "@/lib/validations/books/book-editions/mutate-resource"
import { updateResource } from "@/actions/books/editions/update-resource"
import { updateBookImage } from "@/actions/resources/update-book-image"
import { updateBookVideo } from "@/actions/resources/update-book-video"
import { type TCheckCoverImageRes } from "@/hooks/ai/use-check-cover-image"
import { toast } from "@/hooks/use-toast"
import AudioDropzone from "@/components/ui/audio-dropzone"
import { Button } from "@/components/ui/button"
import { CurrencyInput } from "@/components/ui/currency-input"
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
import PDFDropzone from "@/components/ui/pdf-dropzone"

type Props = {
  open: boolean
  setOpen: (val: boolean) => void
  resource: BookResource
}

function UpdateResourceDialog({ open, setOpen, resource }: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()

  const [isPending, startTransition] = useTransition()

  useState<TCheckCoverImageRes | null>(null)

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }

  const form = useForm<TMutateResourceSchema>({
    resolver: zodResolver(mutateResourceSchema),
    defaultValues: {
      resourceSize: resource.resourceSize || 0,
      borrowPrice: resource.borrowPrice || undefined,
      defaultBorrowDurationDays:
        resource.defaultBorrowDurationDays || undefined,
      fileFormat: resource.fileFormat || undefined,
      provider: resource.provider || undefined,
      providerPublicId: resource.providerPublicId || undefined,
      resourceTitle: resource.resourceTitle || undefined,
      resourceType: resource.resourceType || undefined,
      resourceUrl: resource.resourceUrl || undefined,
    },
  })

  const onSubmit = async (values: TMutateResourceSchema) => {
    startTransition(async () => {
      if (!values.resourceUrl) {
        if (values.resourceType === EResourceBookType.AUDIO_BOOK) {
          const data = await updateBookVideo(
            resource.resourceUrl,
            values.fileAudioBook
          )
          if (data && data !== NOT_CLOUDINARY_URL) {
            values.resourceUrl = data.secureUrl
            values.providerPublicId = data.publicId
            values.resourceSize = Math.round(values.fileAudioBook.size)
          }
        } else {
          console.log("updateBookImage")

          const data = await updateBookImage(
            resource.resourceUrl,
            values.fileEbook
          )
          if (data && data !== NOT_CLOUDINARY_URL) {
            values.resourceUrl = data.secureUrl
            values.providerPublicId = data.publicId
            values.resourceSize = Math.round(values.fileEbook.size)
          }
        }
      }

      values.fileEbook = undefined
      values.fileAudioBook = undefined

      const res = await updateResource({
        ...values,
        resourceId: resource.resourceId,
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

  useEffect(() => {
    console.log({ errors: form.formState.errors })
  }, [form.formState.errors])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>{t("Update resource")}</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 space-y-6"
              >
                {/* <FormField
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
                /> */}

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

export default UpdateResourceDialog
