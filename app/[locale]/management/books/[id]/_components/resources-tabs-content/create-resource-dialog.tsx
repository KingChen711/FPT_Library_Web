"use client"

import { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { EResourceBookType } from "@/lib/types/enums"
import {
  bookResourceSchema,
  type TBookResourceSchema,
} from "@/lib/validations/books/mutate-book"
import { createResource } from "@/actions/books/create-resource"
import { uploadAudioBook, uploadBookImage } from "@/actions/books/upload-medias"
import { type TCheckCoverImageRes } from "@/hooks/books/use-check-cover-image"
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

type Props = {
  bookId: number
}

function CreateResourceDialog({ bookId }: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()

  const [isPending, startTransition] = useTransition()
  const [open, setOpen] = useState(false)

  useState<TCheckCoverImageRes | null>(null)

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }

  const form = useForm<TBookResourceSchema>({
    resolver: zodResolver(bookResourceSchema),
    defaultValues: {
      title: "",
      fileFormat: "",
      //TODO: hardcode warning
      provider: "Cloudinary",
      providerPublicId: "",
      resourceSize: 0,
      resourceType: EResourceBookType.EBOOK,
      resourceUrl: "",
      file: new File([], "file"),
    },
  })

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    const file = e.target.files?.[0]
    //TODO: check type file
    // if (!file?.type.includes("audio")) return
    if (file) {
      const url = URL.createObjectURL(file)
      fieldChange(url)
      form.setValue(`file`, file)
    }
  }

  const onSubmit = async (values: TBookResourceSchema) => {
    startTransition(async () => {
      if (values.file) {
        if (values.resourceType === EResourceBookType.AUDIO_BOOK) {
          const data = await uploadAudioBook(values.file)
          if (data) {
            values.resourceUrl = data.secureUrl
            values.providerPublicId = data.publicId
            values.resourceSize = Math.round(values.file.size)
          }
        } else {
          const data = await uploadBookImage(values.file)
          if (data) {
            values.resourceUrl = data.secureUrl
            values.providerPublicId = data.publicId
            values.resourceSize = Math.round(values.file.size)
          }
        }
      }
      values.file = undefined

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
      <DialogContent className="max-h-[80vh] w-full max-w-3xl overflow-y-auto overflow-x-hidden">
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
                  name={`title`}
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
                            <SelectValue />
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

                <FormField
                  control={form.control}
                  name={`resourceUrl`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        File
                        <span className="text-lg font-bold leading-none text-primary">
                          *
                        </span>
                      </FormLabel>
                      <FormControl>
                        <>
                          <Input
                            disabled={isPending}
                            onChange={(e) =>
                              handleFileUpload(e, field.onChange)
                            }
                            type="file"
                            accept={
                              form.getValues(`resourceType`) ===
                              EResourceBookType.AUDIO_BOOK
                                ? "audio/*"
                                : "application/pdf"
                            }
                            className="w-fit"
                          />

                          {/* <Recording srcUrl={field.value || null} /> */}
                        </>
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
