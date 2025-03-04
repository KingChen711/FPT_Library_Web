import React, { useCallback, useEffect } from "react"
import Image from "next/image"
import { Check, Loader2, Trash2, UploadIcon, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useDropzone } from "react-dropzone"
import { type UseFormReturn } from "react-hook-form"

import { cn } from "@/lib/utils"
import { type TAddCardSchema } from "@/lib/validations/patrons/cards/add-card"
import useCheckAvatar from "@/hooks/ai/use-check-avatar"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"

type Props = {
  form: UseFormReturn<TAddCardSchema>
  isPending: boolean
}

function AddCardAvatarField({ isPending, form }: Props) {
  const t = useTranslations("LibraryCardManagementPage")
  const locale = useLocale()

  const { mutate: checkAvatar, isPending: checkingAvatar } = useCheckAvatar()

  const watchFile = form.watch("file")
  const watchDetectedFacesResult = form.watch("detectedFacesResult")
  const watchValidAvatar =
    watchDetectedFacesResult === undefined
      ? undefined
      : watchDetectedFacesResult.faces.length === 1

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
            <FormDescription>{t("avatar note")}</FormDescription>
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
    </div>
  )
}

export default AddCardAvatarField
