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
import { Loader2, Plus, Trash } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { ResourceType } from "@/lib/types/enums"
import { cn } from "@/lib/utils"
import {
  createAuthorSchema,
  type TCreateAuthorSchema,
} from "@/lib/validations/author/create-author"
import { createAuthor } from "@/actions/authors/create-author"
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
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"

type TUploadImageData = {
  resultCode: string
  message: string
  data: {
    secureUrl: string
    publicId: string
  }
}

type Props = {
  open?: boolean
  setOpen?: (val: boolean) => void
  noTrigger?: boolean
}

function CreateAuthorDialog({
  open: customOpen,
  setOpen: customSetOpen,
  noTrigger = false,
}: Props) {
  const { accessToken } = useAuth()
  const locale = useLocale()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const theme = useActualTheme()
  const [isPending, startTransition] = useTransition()
  const [file, setFile] = useState<File | null>(null)
  const t = useTranslations("GeneralManagement")
  const tAuthorManagement = useTranslations("AuthorManagement")

  const form = useForm<TCreateAuthorSchema>({
    resolver: zodResolver(createAuthorSchema),
    defaultValues: {
      fullName: "",
      authorImage: undefined,
      biography: undefined,
      nationality: undefined,
      dateOfDeath: undefined,
      dob: undefined,
    },
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

  const onSubmit = async (values: TCreateAuthorSchema) => {
    startTransition(async () => {
      try {
        if (file && values.authorImage?.startsWith("blob")) {
          const imageData = await handleUploadImage(file)
          values.authorImage = imageData.data.secureUrl
        }
      } catch {
        toast({
          title: locale === "vi" ? "Thất bại" : "Failed",
          description:
            locale === "vi"
              ? "Có lỗi xảy ra khi tải ảnh tác giả. Vui lòng thử lại hoặc dùng ảnh khác"
              : "There was an error uploading the author image. Please try again or use a different image.",
          variant: "danger",
        })
        return
      }

      const res = await createAuthor(values)
      if (res.isSuccess) {
        if (customSetOpen) {
          customSetOpen(false)
        } else {
          setOpen(false)
        }
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        queryClient.invalidateQueries({
          queryKey: ["management-authors"],
        })
        return
      }

      form.setValue("authorImage", values.authorImage)
      handleServerActionError(res, locale, form)
    })
  }

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault()

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setFile(file)

      if (!file.type.includes("image")) return

      const url = URL.createObjectURL(file)
      fieldChange(url)
    }
  }

  return (
    <Dialog
      open={customOpen === undefined ? open : customOpen}
      onOpenChange={customSetOpen === undefined ? setOpen : customSetOpen}
    >
      {!noTrigger && (
        <DialogTrigger asChild>
          <Button>
            <Plus />
            <div>{tAuthorManagement("create author")}</div>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tAuthorManagement("create author")}</DialogTitle>
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
                                    e.stopPropagation()
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
                        <Input
                          type="date"
                          disabled={isPending}
                          {...field}
                          value={field.value || ""}
                        />
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
                        form.clearErrors()
                        if (customSetOpen) {
                          customSetOpen(false)
                        } else {
                          setOpen(false)
                        }
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
                    {t("btn.create")}
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

export default CreateAuthorDialog
