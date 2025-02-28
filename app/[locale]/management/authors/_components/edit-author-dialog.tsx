/* eslint-disable @typescript-eslint/no-base-to-string */
"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { editorPlugin, ServerUrl } from "@/constants"
import { useAuth } from "@/contexts/auth-provider"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { Editor } from "@tinymce/tinymce-react"
import axios from "axios"
import { Loader2, Trash } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { ResourceType } from "@/lib/types/enums"
import { type Author } from "@/lib/types/models"
import { cn, formatDate, formatDateInput } from "@/lib/utils"
import {
  editAuthorSchema,
  type TEditAuthorSchema,
} from "@/lib/validations/author/edit-author"
import { updateAuthor } from "@/actions/authors/update-author"
import { toast } from "@/hooks/use-toast"
import useActualTheme from "@/hooks/utils/use-actual-theme"
import { Button } from "@/components/ui/button"
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
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"

type Props = {
  author: Author
  openEdit: boolean
  setOpenEdit: (value: boolean) => void
}

type TUploadImageData = {
  resultCode: string
  message: string
  data: {
    secureUrl: string
    publicId: string
  }
}

function EditAuthorDialog({ author, openEdit, setOpenEdit }: Props) {
  console.log("🚀🚀🚀 ~ MutateAuthorDialog ~ author:", author)
  const { accessToken } = useAuth()
  const locale = useLocale()
  const queryClient = useQueryClient()
  const theme = useActualTheme()
  const [isPending, startTransition] = useTransition()
  const [file, setFile] = useState<File | null>(null)
  const t = useTranslations("GeneralManagement")
  const tAuthorManagement = useTranslations("AuthorManagement")

  const form = useForm<TEditAuthorSchema>({
    resolver: zodResolver(editAuthorSchema),
    defaultValues: {
      authorCode: author.authorCode || "",
      fullName: author.fullName || "",
      authorImage: author.authorImage ? author.authorImage : undefined,
      biography: author.biography ? author.biography : undefined,
      nationality: author.nationality ? author.nationality : undefined,
      dateOfDeath: author.dateOfDeath
        ? formatDateInput(author.dateOfDeath)
        : undefined,
      dob: author.dob ? formatDateInput(author.dob) : undefined,
    },
  })

  console.log({
    authorCode: author.authorCode || "",
    fullName: author.fullName || "",
    authorImage: author.authorImage ? author.authorImage : undefined,
    biography: author.biography ? author.biography : undefined,
    nationality: author.nationality ? author.nationality : undefined,
    dateOfDeath: author.dateOfDeath
      ? formatDate(author.dateOfDeath)
      : undefined,
    dob: author.dob ? formatDate(author.dob) : undefined,
  })

  const handleUploadImage = async (file: File): Promise<TUploadImageData> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("resourceType", ResourceType.Profile)
    const res = await axios.post(
      `${ServerUrl}/api/management/resources/images/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    )

    const data = res.data as TUploadImageData
    return data
  }

  const onSubmit = async (values: TEditAuthorSchema) => {
    startTransition(async () => {
      if (file) {
        const imageData = await handleUploadImage(file)
        const payload = {
          ...values,
          authorImage: imageData.data.secureUrl,
        }
        const res = await updateAuthor(author.authorId, payload)
        if (res.isSuccess) {
          form.reset()
          setOpenEdit(false)
          toast({
            title: locale === "vi" ? "Thành công" : "Success",
            description: res.data,
            variant: "success",
          })
        } else {
          handleServerActionError(res, locale, form)
        }
      }

      if (!file) {
        const res = await updateAuthor(author.authorId, values)
        if (res.isSuccess) {
          form.reset()
          setOpenEdit(false)
          toast({
            title: locale === "vi" ? "Thành công" : "Success",
            description: res.data,
            variant: "success",
          })
        } else {
          handleServerActionError(res, locale, form)
        }
      }
    })

    queryClient.invalidateQueries({
      queryKey: ["management-authors"],
    })
  }

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault()

    const fileReader = new FileReader()

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setFile(file)

      if (!file.type.includes("image")) return

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || ""
        fieldChange(imageDataUrl)
      }

      fileReader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={openEdit} onOpenChange={setOpenEdit}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tAuthorManagement("update author")}</DialogTitle>
          <DialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-4 space-y-6"
              >
                <FormField
                  control={form.control}
                  name="authorImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <div>
                          <div>{t("fields.avatar")}</div>
                          <div className="flex justify-center">
                            {field.value ? (
                              <div
                                className={cn(
                                  "group relative mt-2 flex size-32 items-center justify-center overflow-hidden rounded-md border-2"
                                )}
                              >
                                <Image
                                  src={field.value}
                                  alt="imageUrl"
                                  width={200}
                                  height={200}
                                  className="rounded-md object-contain group-hover:opacity-55"
                                />

                                <Button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    field.onChange("")
                                  }}
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-2 top-2 hidden group-hover:inline-flex"
                                >
                                  <Trash />
                                </Button>
                              </div>
                            ) : (
                              <div
                                className={cn(
                                  "mt-2 flex size-32 cursor-pointer flex-col items-center justify-center gap-y-2 rounded-md border-[3px] border-dashed"
                                )}
                              >
                                <Icons.Upload className="size-6" />
                                <div>{t("btn.upload")}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          placeholder="Add profile photo"
                          className="hidden"
                          onChange={(e) => handleImageChange(e, field.onChange)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="authorCode"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("fields.authorCode")}</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          {...field}
                          // value={field.value ?? ""}
                          placeholder={t("placeholder.code")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("fields.fullName")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t("placeholder.fullName")}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="biography"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("fields.biography")}</FormLabel>
                      <FormControl>
                        <Editor
                          disabled={isPending}
                          value={field.value}
                          apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                          onEditorChange={field.onChange}
                          init={{
                            ...editorPlugin,
                            skin: theme === "dark" ? "oxide-dark" : undefined,
                            content_css: theme === "dark" ? "dark" : undefined,
                            width: "100%",
                            language: locale,
                          }}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("fields.nationality")}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t("placeholder.nationality")}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("fields.dob")}</FormLabel>
                      <FormControl>
                        <Input type="date" disabled={isPending} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfDeath"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel>{t("fields.dateOfDeath")}</FormLabel>
                      <FormControl>
                        <Input type="date" disabled={isPending} {...field} />
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
                      onClick={() => {
                        form.reset()
                        form.clearErrors()
                        setOpenEdit(false)
                      }}
                    >
                      {t("btn.cancel")}
                    </Button>
                  </DialogClose>

                  <Button
                    disabled={isPending}
                    type="submit"
                    className="float-right mt-4"
                  >
                    {t("btn.save")}
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

export default EditAuthorDialog
