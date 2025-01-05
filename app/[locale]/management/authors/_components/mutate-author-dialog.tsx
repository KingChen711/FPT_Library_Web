"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-provider"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { format } from "date-fns"
import { Loader2, Plus, Trash } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { ResourceType } from "@/lib/types/enums"
import { type Author } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import {
  mutateAuthorSchema,
  type TMutateAuthorSchema,
} from "@/lib/validations/author/mutate-author"
import { createAuthor } from "@/actions/authors/create-author"
import { updateAuthor } from "@/actions/authors/update-author"
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
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"

type Props = {
  type: "create" | "update"
  author?: Author
  openEdit?: boolean
  setOpenEdit?: (value: boolean) => void
} & (
  | {
      type: "create"
    }
  | {
      type: "update"
      author: Author
      openEdit: boolean
      setOpenEdit: (value: boolean) => void
    }
)

type TUploadImageData = {
  resultCode: string
  message: string
  data: {
    secureUrl: string
    publicId: string
  }
}

function MutateAuthorDialog({ type, author, openEdit, setOpenEdit }: Props) {
  const { accessToken } = useAuth()
  const locale = useLocale()
  const [open, setOpen] = useState(false)
  const [avatar, setAvatar] = useState<string>("")
  const [isPending, startTransition] = useTransition()
  const [file, setFile] = useState<File | null>(null)
  const t = useTranslations("GeneralManagement")
  const tAuthorManagement = useTranslations("AuthorManagement")
  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    if (type === "create") {
      setOpen(value)
      return
    }
    setOpenEdit(value)
  }

  const form = useForm<TMutateAuthorSchema>({
    resolver: zodResolver(mutateAuthorSchema),
    defaultValues: {
      fullName: type === "update" ? author.fullName : "",
      authorImage: type === "update" ? author.authorImage : avatar,
      authorCode: type === "update" ? author.authorCode : "",
      biography: type === "update" ? author.biography : "",
      nationality: type === "update" ? author.nationality : "",
      dateOfDeath: type === "update" ? author.dateOfDeath : null,
      dob: type === "update" ? format(new Date(author.dob), "yyyy-MM-dd") : "",
    },
  })

  const handleUploadImage = async (file: File): Promise<TUploadImageData> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("resourceType", ResourceType.Profile)
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/management/resources/images/upload`,
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
    // console.log("🚀 ~ handleUploadImage ~ data.data.secureUrl:", data.data.secureUrl)
    // form.setValue("authorImage", data.data.secureUrl)
    // setAvatar(data.data.secureUrl)
  }

  const onSubmit = async (values: TMutateAuthorSchema) => {
    if (!file) {
      toast({
        title: "Please upload image",
        variant: "danger",
      })
      return
    }

    startTransition(async () => {
      if (type === "create") {
        if (!file) {
          toast({
            title: "Please upload image",
            variant: "danger",
          })
          return
        }
        const imageData = await handleUploadImage(file)
        console.log("🚀 ~ onSubmit ~ values:", values)
        console.log("🚀 ~ startTransition ~ imageData:", imageData)
        console.log({
          ...values,
          authorImage: imageData.data.secureUrl,
        })

        const res = await createAuthor({
          ...values,
          authorImage: imageData.data.secureUrl,
        })
        console.log("🚀 ~ startTransition ~ res:", res)
        if (res.isSuccess) {
          form.reset()
          setOpen(false)
          toast({
            title: "Create author successfully",
            variant: "success",
          })
        } else {
          handleServerActionError(res, locale, form)
        }
      }

      if (type === "update") {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        await handleUploadImage(file)
        const res = await updateAuthor(author.authorId, values)
        if (res.isSuccess) {
          form.reset()
          setOpenEdit(false)
          toast({
            title: "Update author successfully",
            variant: "success",
          })
        } else {
          handleServerActionError(res, locale, form)
        }
      }
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
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        const imageDataUrl = event.target?.result?.toString() || ""
        fieldChange(imageDataUrl)
      }

      fileReader.readAsDataURL(file)
    }
  }

  return (
    <Dialog
      open={type === "create" ? open : openEdit}
      onOpenChange={handleOpenChange}
    >
      {type === "create" && (
        <DialogTrigger asChild>
          <Button className="flex items-center justify-end gap-x-1 leading-none">
            <Plus />
            <div>{tAuthorManagement("create author")}</div>
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {tAuthorManagement(
              type === "create" ? "create author" : "update author"
            )}
          </DialogTitle>
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
                          disabled={isPending || type === "update"}
                          {...field}
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
                        <Input
                          {...field}
                          placeholder={t("placeholder.biography")}
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
                        <Input
                          type="date"
                          disabled={isPending}
                          {...field}
                          value={field.value ?? null}
                        />
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
                    >
                      {t("btn.cancel")}
                    </Button>
                  </DialogClose>

                  <Button
                    disabled={isPending}
                    type="submit"
                    className="float-right mt-4"
                  >
                    {t(type === "create" ? "btn.create" : "btn.save")}
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

export default MutateAuthorDialog
