"use client"

import React, { useCallback, useEffect, useTransition } from "react"
import Image from "next/image"
import { useRouter } from "@/i18n/routing"
import { zodResolver } from "@hookform/resolvers/zod"
import { getLocalTimeZone } from "@internationalized/date"
import { Check, Loader2, Trash2, UploadIcon, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useDropzone } from "react-dropzone"
import { useForm } from "react-hook-form"

import handleServerActionError from "@/lib/handle-server-action-error"
import { EGender } from "@/lib/types/enums"
import { cn } from "@/lib/utils"
import {
  createPatronSchema,
  type TCreatePatronSchema,
} from "@/lib/validations/holders/create-patron"
import { uploadBookImage } from "@/actions/books/upload-medias"
import { createPatron } from "@/actions/library-card/holders/create-patron"
import useCheckAvatar from "@/hooks/ai/use-check-avatar"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  createCalendarDate,
  DateTimePicker,
} from "@/components/ui/date-time-picker/index"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function CreatePatronForm() {
  const t = useTranslations("LibraryCardManagementPage")
  const router = useRouter()
  const timezone = getLocalTimeZone()
  const locale = useLocale()

  const [isPending, startTransition] = useTransition()

  const { mutate: checkAvatar, isPending: checkingAvatar } = useCheckAvatar()

  const form = useForm<TCreatePatronSchema>({
    resolver: zodResolver(createPatronSchema),
    defaultValues: {
      gender: EGender.MALE,
    },
  })

  const watchFile = form.watch("file")
  const watchDetectedFacesResult = form.watch("detectedFacesResult")
  const watchValidAvatar =
    watchDetectedFacesResult === undefined
      ? undefined
      : watchDetectedFacesResult.faces.length === 1

  function onSubmit(values: TCreatePatronSchema) {
    startTransition(async () => {
      const avatarFile = values.file

      if (avatarFile && values.avatar.startsWith("blob")) {
        const data = await uploadBookImage(avatarFile)
        if (!data) {
          toast({
            title: locale === "vi" ? "Thất bại" : "Fail",
            description:
              locale === "vi" ? "Lỗi không xác định" : "Unknown error",
            variant: "danger",
          })
          return
        }
        values.avatar = data.secureUrl
      }

      values.file = undefined

      const res = await createPatron(values)
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        router.push("/management/library-card-holders")
        return
      }

      //*Just do this on fail
      form.setValue("avatar", values.avatar)
      handleServerActionError(res, locale, form)
    })
  }

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      form.setValue(`file`, file)
      const url = URL.createObjectURL(file)
      form.setValue(`avatar`, url)
      form.clearErrors(`avatar`)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    maxSize: 10 * 1024 * 1024,
    disabled: isPending,
    onDropRejected: (fileRejections) => {
      const error = fileRejections[0]?.errors[0]
      if (error?.code === "file-too-large") {
        toast({
          title: locale === "vi" ? "Thất bại" : "Failed",
          description: locale === "vi" ? "Ảnh quá lớn" : "Image is too large",
          variant: "danger",
        })
      } else if (error?.code === "file-invalid-type") {
        toast({
          title: locale === "vi" ? "Thất bại" : "Failed",
          description:
            locale === "vi" ? "Tệp không hợp lệ" : "Invalid file type",
          variant: "danger",
        })
      }
    },
  })

  const handleCheckAvatar = useCallback(() => {
    const formData = new FormData()

    if (!watchFile) return

    formData.append("file", watchFile)
    formData.append("attributes", "gender")

    checkAvatar(formData, {
      onSuccess: (data) => {
        form.setValue(`detectedFacesResult`, data)
        const countFaces = data.faces.length
        if (countFaces === 0) {
          form.setError("avatar", { message: "validAvatarAI0" })
          return
        }
        if (countFaces > 1) {
          form.setError("avatar", { message: "validAvatarAI*" })
          return
        }

        const gender = data.faces[0].attributes?.gender?.value
        if (gender) {
          form.setValue("gender", gender)
        }
        form.clearErrors(`avatar`)
      },
      onError: () => {
        form.setValue(`detectedFacesResult`, undefined)

        toast({
          title: locale === "vi" ? "Thất bại" : "Failed",
          description:
            locale === "vi"
              ? "Lỗi không xác định khi kiểm tra ảnh bìa"
              : "Unknown error while checking cover image",
          variant: "danger",
        })
      },
    })
  }, [checkAvatar, form, locale, watchFile])

  useEffect(() => {
    form.setValue("detectedFacesResult", undefined)
  }, [watchFile, form])

  useEffect(() => {
    if (isPending || !watchFile || watchDetectedFacesResult) return

    handleCheckAvatar()
  }, [watchFile, form, isPending, handleCheckAvatar, watchDetectedFacesResult])

  return (
    <div>
      <div className="mt-4 flex flex-wrap items-start gap-4">
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-semibold">{t("Create patron")}</h3>
        </div>
      </div>

      {/* {isFetchingSearchIsbn && (
        <div className="flex items-center gap-2">
          {t("Loading scanned book")}
          <Loader2 className="size-4 animate-spin" />{" "}
        </div>
      )} */}

      {/* {scannedBooks.length > 0 && (
        <div className="flex flex-col gap-2">
          <Label>{t("Scanned book")}</Label>
          <div className="grid">
            <div className="flex gap-4 overflow-x-auto overflow-y-hidden pb-6">
              {scannedBooks.map((book) => (
                <div
                  key={book.isbn}
                  className="mt-4 flex h-full flex-col gap-2"
                >
                  {book.notFound ? (
                    <div className="text-sm">
                      {t("not found isbn", { isbn: book.isbn })}
                    </div>
                  ) : (
                    <ScannedBook book={book} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )} */}

      <div className="mt-4 flex flex-col gap-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex gap-4 max-lg:flex-col">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      {t("Email")}
                      <span className="ml-1 text-xl font-bold leading-none text-primary">
                        *
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      {t("First name")}
                      <span className="ml-1 text-xl font-bold leading-none text-primary">
                        *
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>
                      {t("Last name")}
                      <span className="ml-1 text-xl font-bold leading-none text-primary">
                        *
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-4 max-lg:flex-col">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t("Phone")}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t("Address")}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>{t("Date of birth")}</FormLabel>
                    <FormControl>
                      <DateTimePicker
                        value={createCalendarDate(field.value)}
                        onChange={(date) =>
                          field.onChange(date ? date.toDate(timezone) : null)
                        }
                        disabled={(date) => date > new Date()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-1">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div>
                        {t("Avatar")} (&lt;10MB)
                        <span className="ml-1 text-xl font-bold leading-none text-primary">
                          *
                        </span>
                      </div>
                      {field.value ? (
                        <div
                          className={cn(
                            "group relative mt-2 w-fit overflow-hidden rounded-md",
                            isPending && "pointer-events-none opacity-80"
                          )}
                        >
                          <Image
                            src={field.value}
                            alt="imageUrl"
                            width={288}
                            height={288}
                            className="aspect-square max-w-full rounded-md border object-fill group-hover:opacity-90"
                          />
                          <Button
                            onClick={(e) => {
                              e.preventDefault()
                              field.onChange("")
                              form.setValue(`file`, undefined)
                            }}
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-2 z-50 hidden group-hover:inline-flex"
                          >
                            <Trash2 className="text-danger" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          {...getRootProps()}
                          className={cn(
                            "mt-2 flex aspect-square w-72 max-w-full cursor-pointer flex-col items-center justify-center gap-y-2 rounded-md border-[3px] border-dashed transition-colors",
                            isDragActive && "border-primary bg-primary/10",
                            isPending && "pointer-events-none opacity-80"
                          )}
                        >
                          <input {...getInputProps()} />
                          <UploadIcon className="size-12" />
                          <p className="p-4 text-center text-sm">
                            {isDragActive
                              ? t("Drop the image here")
                              : t("Drag & drop or click to upload")}
                          </p>
                        </div>
                      )}
                    </FormLabel>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col">
                <Label className="mb-1">
                  {t("Check avatar result")}
                  <span className="ml-1 text-xl font-bold leading-none text-transparent">
                    *
                  </span>
                </Label>
                {!watchFile && <div>{t("No image uploaded yet")}</div>}
                {checkingAvatar && (
                  <div className="flex items-center">
                    {t("Checking")}
                    <Loader2 className="size-4 animate-spin" />
                  </div>
                )}
                <div className="flex flex-col gap-2 text-sm">
                  {watchFile &&
                    !checkingAvatar &&
                    (watchValidAvatar === undefined ? (
                      <div>{t("Not checked yet")}</div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <strong>{t("Result")}</strong>
                        <div>{t(watchValidAvatar ? "Passed" : "Failed")}</div>
                        <div>
                          {watchValidAvatar ? (
                            <Check className="text-success" />
                          ) : (
                            <X className="text-danger" />
                          )}
                        </div>
                      </div>
                    ))}
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleCheckAvatar()
                    }}
                    disabled={isPending || checkingAvatar || !watchFile}
                    size="sm"
                    className="w-fit"
                  >
                    {t("Check")}
                  </Button>
                </div>
              </div>

              {watchValidAvatar && (
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Gender")}</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(
                            value !== undefined
                              ? parseInt(value, 10)
                              : undefined
                          )
                        }
                        value={field.value?.toString() || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">{t("Male")}</SelectItem>
                          <SelectItem value="Female">{t("Female")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="flex justify-end gap-x-4">
              <Button
                disabled={isPending}
                variant="secondary"
                className="float-right mt-4"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  router.push("/management/library-card-holders")
                }}
              >
                {t("Cancel")}
              </Button>

              <Button
                disabled={isPending}
                type="submit"
                className="float-right mt-4"
              >
                {t("Continue")}
                {isPending && <Loader2 className="ml-1 size-4 animate-spin" />}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default CreatePatronForm
