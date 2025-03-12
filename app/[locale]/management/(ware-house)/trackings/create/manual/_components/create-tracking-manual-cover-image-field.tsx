import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Check, Loader2, Trash2, UploadIcon, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useDropzone } from "react-dropzone"
import { type UseFormReturn } from "react-hook-form"

import { type Author } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { type TCreateTrackingManualSchema } from "@/lib/validations/trackings/create-tracking-manual"
import useCheckCoverImage from "@/hooks/ai/use-check-cover-image"
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
  form: UseFormReturn<TCreateTrackingManualSchema>
  isPending: boolean
  selectedAuthors: Author[]
  isRequireImage: boolean
  index: number
}

function CoverImageField({
  form,
  isPending,
  selectedAuthors,
  isRequireImage,
  index,
}: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()
  const [disableImageField, setDisableImageField] = useState(false)

  const watchAuthorIds = form.watch(
    `warehouseTrackingDetails.${index}.libraryItem.authorIds`
  )

  const watchTitle = form.watch(
    `warehouseTrackingDetails.${index}.libraryItem.title`
  )
  const watchSubTitle = form.watch(
    `warehouseTrackingDetails.${index}.libraryItem.subTitle`
  )
  const watchGeneralNote = form.watch(
    `warehouseTrackingDetails.${index}.libraryItem.generalNote`
  )
  const watchPublisher = form.watch(
    `warehouseTrackingDetails.${index}.libraryItem.publisher`
  )
  const watchFile = form.watch(
    `warehouseTrackingDetails.${index}.libraryItem.file`
  )
  const watchValidImage = form.watch(
    `warehouseTrackingDetails.${index}.libraryItem.validImage`
  )
  const watchCheckedResult = form.watch(
    `warehouseTrackingDetails.${index}.libraryItem.checkedResult`
  )

  const { mutate: checkImage, isPending: checkingImage } = useCheckCoverImage()

  const [mounted, setMounted] = useState(false)

  const canCheck = !!(
    watchAuthorIds &&
    watchAuthorIds.length > 0 &&
    watchTitle &&
    watchPublisher &&
    watchFile &&
    !checkingImage
  )

  useEffect(() => {
    if (
      !watchAuthorIds ||
      watchAuthorIds.length === 0 ||
      !watchTitle ||
      !watchPublisher
    ) {
      setDisableImageField(true)
    } else {
      setDisableImageField(false)
    }
  }, [form, watchAuthorIds, watchTitle, watchPublisher])

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      form.setValue(`warehouseTrackingDetails.${index}.libraryItem.file`, file)
      const url = URL.createObjectURL(file)
      form.setValue(
        `warehouseTrackingDetails.${index}.libraryItem.coverImage`,
        url
      )
      form.clearErrors(
        `warehouseTrackingDetails.${index}.libraryItem.coverImage`
      )
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    maxSize: 10 * 1024 * 1024,
    disabled: disableImageField || isPending,
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleCheckImage = () => {
    const formData = new FormData()

    if (!watchFile) return

    formData.append("Images", watchFile)

    const title = watchTitle
    const subTitle = watchSubTitle
    const generalNote = watchGeneralNote
    const publisher = watchPublisher
    const authors = selectedAuthors
      .map((author) => {
        if (watchAuthorIds?.includes(author.authorId)) return author.fullName
        return false
      })
      .filter((item) => item !== false)

    if (title) {
      formData.append("Title", title)
    }

    if (subTitle) {
      formData.append("SubTitle", subTitle)
    }
    if (generalNote) {
      formData.append("GeneralNote", generalNote)
    }
    formData.append("Publisher", publisher || "")

    authors.forEach((author) => {
      formData.append("Authors", author)
    })

    checkImage(formData, {
      onSuccess: (data) => {
        const validImage = data[0].totalPoint >= data[0].confidenceThreshold
        form.setValue(
          `warehouseTrackingDetails.${index}.libraryItem.checkedResult`,
          data[0]
        )
        form.setValue(
          `warehouseTrackingDetails.${index}.libraryItem.validImage`,
          validImage
        )
        if (validImage)
          if (validImage)
            form.clearErrors(
              `warehouseTrackingDetails.${index}.libraryItem.coverImage`
            )
      },
      onError: () => {
        form.setValue(
          `warehouseTrackingDetails.${index}.libraryItem.checkedResult`,
          undefined
        )
        form.setValue(
          `warehouseTrackingDetails.${index}.libraryItem.validImage`,
          false
        )
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
  }

  useEffect(() => {
    if (!mounted) return
    form.setValue(
      `warehouseTrackingDetails.${index}.libraryItem.validImage`,
      undefined
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    form,
    watchTitle,
    watchPublisher,
    watchAuthorIds,
    watchSubTitle,
    watchGeneralNote,
  ])

  useEffect(() => {
    if (!mounted) return
    form.setValue(
      `warehouseTrackingDetails.${index}.libraryItem.checkedResult`,
      undefined
    )
    form.setValue(
      `warehouseTrackingDetails.${index}.libraryItem.validImage`,
      undefined
    )
    form.clearErrors(`warehouseTrackingDetails.${index}.libraryItem.coverImage`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, watchFile])

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex flex-row justify-start gap-6">
      <FormField
        control={form.control}
        name={`warehouseTrackingDetails.${index}.libraryItem.coverImage`}
        render={({ field }) => (
          <FormItem className={cn(disableImageField && "cursor-not-allowed")}>
            <FormLabel
              className={cn(
                disableImageField &&
                  "pointer-events-none cursor-not-allowed opacity-60"
              )}
            >
              <div>
                {t("Cover image")} (&lt;10MB)
                {isRequireImage && (
                  <span className="ml-1 text-xl font-bold leading-none text-primary">
                    *
                  </span>
                )}
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
                    width={192}
                    height={288}
                    className="aspect-[2/3] rounded-md border object-fill group-hover:opacity-90"
                  />
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      field.onChange("")
                      form.setValue(
                        `warehouseTrackingDetails.${index}.libraryItem.file`,
                        undefined
                      )
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
                    "mt-2 flex aspect-[2/3] h-72 cursor-pointer flex-col items-center justify-center gap-y-2 rounded-md border-[3px] border-dashed transition-colors",
                    isDragActive && "border-primary bg-primary/10",
                    isPending && "pointer-events-none opacity-80",
                    disableImageField && "cursor-not-allowed opacity-60"
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

            <FormDescription>
              {t(
                "You need to enter title, publisher, authors before uploading cover image"
              )}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex flex-col">
        <Label className="mb-1">
          {t("Check cover image result")}
          <span className="ml-1 text-xl font-bold leading-none text-transparent">
            *
          </span>
        </Label>
        {!watchFile && <div>{t("No image uploaded yet")}</div>}
        {checkingImage && (
          <div className="flex items-center">
            {t("Checking")}
            <Loader2 className="size-4 animate-spin" />
          </div>
        )}
        <div className="flex flex-col gap-2 text-sm">
          {watchFile &&
            !checkingImage &&
            (watchValidImage === undefined ? (
              <div>{t("Not checked yet")}</div>
            ) : (
              <div className="flex items-center gap-2">
                <strong>{t("Result")}</strong>
                <div>{t(watchValidImage ? "Passed" : "Failed")}</div>
                <div>
                  {watchValidImage ? (
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
              handleCheckImage()
            }}
            disabled={!canCheck}
            size="sm"
            className="w-fit"
          >
            {t("Check")}
          </Button>
          {watchFile && !checkingImage && watchCheckedResult && (
            <>
              <div className="flex items-center gap-2">
                <strong>{t("Average point")}</strong>
                <div>{watchCheckedResult.totalPoint.toFixed(2)}/100</div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {watchCheckedResult.fieldPointsWithThreshole.map((field) => {
                  const fieldName = field.name.includes("Author")
                    ? t("Author general note")
                    : t(field.name)

                  return (
                    <div
                      key={field.name}
                      className="flex flex-col gap-2 rounded-md border bg-card p-4 text-card-foreground"
                    >
                      <div className="flex items-center gap-2">
                        <strong>{fieldName}:</strong>
                        <div>{field.detail}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <strong>{t("Matched point")}</strong>
                        <div>{field.matchedPoint}/100</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CoverImageField
