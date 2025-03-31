import React from "react"
import Image from "next/image"
import { Check, Loader2, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { type UseFormReturn } from "react-hook-form"

import { cn } from "@/lib/utils"
import { type TTrainGroupsSchema } from "@/lib/validations/books/train-groups"
import useCheckCoverImage from "@/hooks/ai/use-check-cover-image"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"

type Props = {
  form: UseFormReturn<TTrainGroupsSchema>
  isPending: boolean
  groupIndex: number
  bookIndex: number
  indexImage: number
  title: string
  publisher: string
  subTitle: string | null | undefined
  generalNote: string | null | undefined
  authorNames: string[]
}

function CoverImageField({
  form,
  isPending,
  groupIndex,
  bookIndex,
  indexImage,
  title,
  subTitle,
  generalNote,
  publisher,
  authorNames,
}: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()

  const watchFile = form.watch(
    `groups.${groupIndex}.books.${bookIndex}.imageList.${indexImage}.file`
  )
  const watchValidImage = form.watch(
    `groups.${groupIndex}.books.${bookIndex}.imageList.${indexImage}.validImage`
  )
  const watchCheckedResult = form.watch(
    `groups.${groupIndex}.books.${bookIndex}.imageList.${indexImage}.checkedResult`
  )

  const { mutate: checkImage, isPending: checkingImage } = useCheckCoverImage()

  const handleCheckImage = () => {
    const formData = new FormData()

    if (!watchFile) return

    formData.append("Images", watchFile)

    formData.append("Title", title)
    if (subTitle) {
      formData.append("SubTitle", subTitle)
    }
    if (generalNote) {
      formData.append("GeneralNote", generalNote)
    }
    formData.append("Publisher", publisher || "")

    authorNames.forEach((author) => {
      formData.append("Authors", author)
    })

    checkImage(formData, {
      onSuccess: (data) => {
        const validImage = data[0].totalPoint >= data[0].confidenceThreshold
        form.setValue(
          `groups.${groupIndex}.books.${bookIndex}.imageList.${indexImage}.checkedResult`,
          data[0]
        )
        form.setValue(
          `groups.${groupIndex}.books.${bookIndex}.imageList.${indexImage}.validImage`,
          validImage
        )
        if (validImage)
          form.clearErrors(
            `groups.${groupIndex}.books.${bookIndex}.imageList.${indexImage}.coverImage`
          )
      },
      onError: () => {
        form.setValue(
          `groups.${groupIndex}.books.${bookIndex}.imageList.${indexImage}.checkedResult`,
          undefined
        )
        form.setValue(
          `groups.${groupIndex}.books.${bookIndex}.imageList.${indexImage}.validImage`,
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

  return (
    <div className="flex flex-row justify-start gap-16 p-6">
      <FormField
        control={form.control}
        name={`groups.${groupIndex}.books.${bookIndex}.imageList.${indexImage}.coverImage`}
        render={({ field }) => (
          <FormItem className="shrink-0">
            <FormLabel>
              <div>{t("Cover image")}</div>
              {field.value && (
                <div
                  className={cn(
                    "relative mt-2 w-fit overflow-hidden rounded-md",
                    isPending && "pointer-events-none opacity-80"
                  )}
                >
                  <Image
                    src={field.value}
                    alt="imageUrl"
                    width={192 * 2}
                    height={288 * 2}
                    className="aspect-[2/3] h-[288px] w-[192px] rounded-md border object-fill"
                  />
                </div>
              )}
            </FormLabel>
            <FormControl></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex flex-col">
        <Label className="mb-1">{t("Check cover image result")}</Label>

        {checkingImage && (
          <div className="flex items-center">
            {t("Checking")}
            <Loader2 className="size-4 animate-spin" />
          </div>
        )}
        <div className="flex flex-col gap-2 text-sm">
          {!checkingImage &&
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
          {indexImage !== 0 && (
            <Button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleCheckImage()
              }}
              disabled={isPending || checkingImage}
              size="sm"
              className="w-fit"
            >
              {t("Check")}
            </Button>
          )}
          {!checkingImage && watchCheckedResult && (
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
