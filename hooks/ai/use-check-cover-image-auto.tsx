import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useLocale } from "next-intl"
import { type UseFormReturn } from "react-hook-form"

import { http } from "@/lib/http"
import { type TTrainGroupsSchema } from "@/lib/validations/books/train-groups"

import { toast } from "../use-toast"
import { type TCheckCoverImageRes } from "./use-check-cover-image"

type Props = {
  form: UseFormReturn<TTrainGroupsSchema>
  groupIndex: number
  bookIndex: number
  indexImage: number
  title: string
  publisher: string
  subTitle: string | null | undefined
  generalNote: string | null | undefined
  authorNames: string[]
}

function useCheckCoverImageAuto(props: Props) {
  const { accessToken } = useAuth()
  const locale = useLocale()

  return useQuery({
    queryKey: ["check-cover-image-auto", props, accessToken],
    queryFn: async (): Promise<TCheckCoverImageRes[] | null> => {
      if (!accessToken) return null

      const {
        authorNames,
        bookIndex,
        form,
        generalNote,
        groupIndex,
        indexImage,
        publisher,
        subTitle,
        title,
      } = props

      if (
        indexImage === 0 ||
        form.watch(
          `groups.${groupIndex}.books.${bookIndex}.imageList.${indexImage}.checkedResult`
        )
      )
        return null

      const watchFile = form.watch(
        `groups.${groupIndex}.books.${bookIndex}.imageList.${indexImage}.file`
      )

      if (!watchFile) return null

      const formData = new FormData()

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

      try {
        const { data } = await http.post<TCheckCoverImageRes[]>(
          `/api/ocr`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        return data
      } catch {
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
        return null
      }
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
}

export default useCheckCoverImageAuto
