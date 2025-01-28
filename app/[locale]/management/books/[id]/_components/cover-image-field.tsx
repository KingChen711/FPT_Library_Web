import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Check, Loader2, Trash2, UploadIcon, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { type UseFormReturn } from "react-hook-form"

import { cn } from "@/lib/utils"
import { type TEditBookSchema } from "@/lib/validations/books/edit-book"
import useCheckCoverImage from "@/hooks/books/use-check-cover-image"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {
  form: UseFormReturn<TEditBookSchema>
  isPending: boolean
  isRequireImage: boolean
  authors: string[]
  initCoverImage: string | null | undefined
}

function CoverImageField({ form, isPending, isRequireImage, authors }: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()
  const [disableImageField, setDisableImageField] = useState(false)

  const watchAuthorIds = form.watch(`authorIds`)
  const watchTitle = form.watch(`title`)
  const watchSubTitle = form.watch(`subTitle`)
  const watchGeneralNote = form.watch(`generalNote`)
  const watchPublisher = form.watch(`publisher`)
  const watchFile = form.watch(`file`)
  const watchValidImage = form.watch(`validImage`)
  const watchCheckedResult = form.watch(`checkedResult`)

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

  const watchCoverImage = form.watch(`coverImage`)

  useEffect(() => {
    console.log({ watchCoverImage })
  }, [watchCoverImage])

  useEffect(() => {
    console.log(watchAuthorIds, watchTitle, watchPublisher)

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

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault()

    const fileReader = new FileReader()

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        toast({
          title: locale === "vi" ? "Thất bại" : "Failed",
          description: locale === "vi" ? "Tệp không hợp lệ" : "Invalid file",
          variant: "danger",
        })
        return
      }

      if (file.size >= 10 * 1024 * 1024) {
        form.setError(`coverImage`, {
          message: locale === "vi" ? "Ảnh quá lớn" : "Image is too large",
        })
        return
      }

      form.clearErrors(`coverImage`)

      form.setValue(`file`, file)

      fileReader.onload = async () => {
        // const imageDataUrl =
        //   typeof event.target?.result === "string" ? event.target.result : ""
        const url = URL.createObjectURL(file)
        fieldChange(url)
      }

      fileReader.readAsDataURL(file)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleCheckImage = () => {
    const formData = new FormData()

    if (!watchFile) return

    formData.append("Images", watchFile)

    const title = watchTitle
    const subTitle = watchSubTitle
    const generalNote = watchGeneralNote
    const publisher = watchPublisher

    formData.append("Title", title)
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
        form.setValue(`checkedResult`, data[0])
        form.setValue(
          `validImage`,
          data[0].totalPoint >= data[0].confidenceThreshold
        )
      },
      onError: () => {
        form.setValue(`checkedResult`, undefined)
        form.setValue(`validImage`, false)
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

  // useEffect(() => {
  //   const handleConvert = async () => {
  //     if (!initCoverImage) return
  //     const file = await fileUrlToFile(initCoverImage, "cover-image")
  //     form.setValue("file", file)
  //   }

  //   handleConvert().finally(() => {
  //     setHasConvertedUrlToFile(true)
  //   })
  // }, [form, initCoverImage])

  useEffect(() => {
    if (!mounted) return
    form.setValue(`validImage`, undefined)
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

    console.log({ mounted })

    form.setValue(`coverImage`, undefined)
    form.setValue("checkedResult", undefined)
    form.setValue("validImage", undefined)
    form.clearErrors(`coverImage`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, watchFile])

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex flex-row justify-start gap-6">
      <FormField
        control={form.control}
        name={`coverImage`}
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
                  className={cn(
                    "mt-2 flex aspect-[2/3] h-72 cursor-pointer flex-col items-center justify-center gap-y-2 rounded-md border-[3px] border-dashed",
                    isPending && "pointer-events-none opacity-80"
                  )}
                >
                  <UploadIcon className="size-12" />
                  <p>{t("Upload")}</p>
                </div>
              )}
            </FormLabel>
            <FormControl>
              <Input
                disabled={isPending}
                type="file"
                accept=".jpg,.jpeg,.png"
                placeholder="Add profile photo"
                className="hidden"
                onChange={(e) => handleImageChange(e, field.onChange)}
              />
            </FormControl>
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
        {!watchCoverImage && !watchFile && (
          <div>{t("No image uploaded yet")}</div>
        )}
        {checkingImage && (
          <div className="flex items-center">
            {t("Checking")}
            <Loader2 className="size-4 animate-spin" />
          </div>
        )}
        <div className="flex flex-col gap-2 text-sm">
          {watchValidImage === undefined ? (
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
          )}
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
                    ? t("Author") + " " + field.name.split(" ")[1]
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
