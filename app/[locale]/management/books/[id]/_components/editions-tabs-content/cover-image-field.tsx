import React, { useEffect, useState } from "react"
import Image from "next/image"
import { Check, Loader2, Trash2, UploadIcon, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { type UseFormReturn } from "react-hook-form"

import { type Author } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { type TCreateEditionSchema } from "@/lib/validations/books/book-editions/create-edition"
import useCheckCoverImage, {
  type TCheckCoverImageRes,
} from "@/hooks/books/use-check-cover-image"
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
  form: UseFormReturn<TCreateEditionSchema>
  isPending: boolean

  selectedAuthors: Author[]
}

function CoverImageField({ form, isPending, selectedAuthors }: Props) {
  const t = useTranslations("BooksManagementPage")
  const [disableImageField, setDisableImageField] = useState(false)
  const [checkedResult, setCheckedResult] =
    useState<TCheckCoverImageRes | null>(null)

  const watchAuthorIds = form.watch(`authorIds`)
  const watchEditionTitle = form.watch(`editionTitle`)
  const watchPublisher = form.watch(`publisher`)
  const watchFile = form.watch(`file`)
  const watchValidImage = form.watch(`validImage`)

  const { mutate: checkImage, isPending: checkingImage } = useCheckCoverImage()

  const canCheck = !!(
    watchAuthorIds &&
    watchEditionTitle &&
    watchPublisher &&
    watchFile &&
    !checkingImage
  )

  useEffect(() => {
    if (
      form.getValues(`authorIds`).length === 0 ||
      !form.getValues(`editionTitle`) ||
      !form.getValues(`publisher`)
    ) {
      setDisableImageField(true)
    } else {
      setDisableImageField(false)
    }
  }, [form, watchAuthorIds, watchEditionTitle, watchPublisher])

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault()

    const fileReader = new FileReader()

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      if (!file.type.includes("image")) return

      if (file.size >= 10 * 1024 * 1024) {
        form.setError(`coverImage`, {
          message: "Ảnh quá lớn.",
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

      handleCheckImage()
    }
  }

  const handleCheckImage = () => {
    const formData = new FormData()

    const file = form.getValues(`file`)

    if (!file) return

    formData.append("Image", file)

    const editionTitle = form.getValues(`editionTitle`)
    const publisher = form.getValues(`publisher`)
    const authors = selectedAuthors
      .map((author) => {
        if (watchAuthorIds.includes(author.authorId)) return author.fullName
        return false
      })
      .filter((item) => item !== false)

    formData.append("Title", editionTitle)
    formData.append("Publisher", publisher)

    authors.forEach((author) => {
      formData.append("Authors", author)
    })

    checkImage(formData, {
      onSuccess: (data) => {
        setCheckedResult(data)

        form.setValue(`validImage`, data.totalPoint >= data.confidenceThreshold)
      },
    })
  }

  useEffect(() => {
    form.setValue(`validImage`, undefined)
  }, [form, watchEditionTitle, watchPublisher, watchAuthorIds])

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
                <span className="ml-1 text-xl font-bold leading-none text-primary">
                  *
                </span>
              </div>
              {field.value ? (
                <div
                  className={cn(
                    "group relative mt-2 flex size-64 items-center justify-center rounded-md border-2",
                    isPending && "pointer-events-none opacity-80"
                  )}
                >
                  <Image
                    src={field.value}
                    alt="imageUrl"
                    width={168}
                    height={252}
                    className="rounded-md object-contain group-hover:opacity-90"
                  />
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      field.onChange("")
                      form.setValue(`file`, undefined)
                    }}
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                  >
                    <Trash2 className="text-danger" />
                  </Button>
                </div>
              ) : (
                <div
                  className={cn(
                    "mt-2 flex size-64 cursor-pointer flex-col items-center justify-center gap-y-2 rounded-md border-[3px] border-dashed",
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
                accept="image/*"
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
        {!watchFile && <div>{t("No image uploaded yet")}</div>}
        {checkingImage && (
          <div className="flex items-center">
            {t("Checking")}
            <Loader2 className="size-4 animate-spin" />
          </div>
        )}
        <div className="flex flex-col gap-2 text-sm">
          {watchFile && !checkingImage && (
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
          {watchFile && !checkingImage && checkedResult && (
            <>
              <div className="flex items-center gap-2">
                <strong>{t("Average point")}</strong>
                <div>{checkedResult.totalPoint.toFixed(2)}/100</div>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {checkedResult.fieldPoints.map((field) => {
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
