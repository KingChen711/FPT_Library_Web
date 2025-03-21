import { type SetStateAction } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

import { ESearchType } from "@/lib/types/enums"
import { formUrlQuery } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

export type TBasicSearch = {
  title: string
  author: string
  isbn: string
  classificationNumber: string
  genres: string
  publisher: string
  topicalTerms: string
}

type Props = {
  values: TBasicSearch
  setValues: React.Dispatch<SetStateAction<TBasicSearch>>
  management?: boolean
  isTrained?: boolean | undefined
  setIsTrained?: React.Dispatch<SetStateAction<boolean | undefined>>
  canBorrow?: boolean | undefined
  setCanBorrow?: React.Dispatch<SetStateAction<boolean | undefined>>
}

const BasicSearchTab = ({
  setValues,
  values,
  management,
  canBorrow,
  isTrained,
  setCanBorrow,
  setIsTrained,
}: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const t = useTranslations("BasicSearchTab")

  const handleInputChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const resetFields = () => {
    setValues({
      author: "",
      classificationNumber: "",
      genres: "",
      isbn: "",
      publisher: "",
      title: "",
      topicalTerms: "",
    })
    setIsTrained?.(undefined)
    setCanBorrow?.(undefined)
  }

  const handleApply = () => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        ...values,
        pageIndex: "1",
        searchType: ESearchType.BASIC_SEARCH.toString(),
        search: null,
        isTrained: isTrained === undefined ? null : isTrained.toString(),
        canBorrow: canBorrow === undefined ? null : canBorrow.toString(),
      },
    }).replace(
      window.location.pathname,
      management ? "/management/books" : `/search/result`
    )

    router.push(newUrl)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        {Object.keys(values).map((key, index) => (
          <div key={index} className="flex w-full flex-nowrap items-center">
            <Input
              placeholder={t(getPlaceholder(key))}
              className="border-dashed"
              value={values[key as keyof typeof values]}
              onChange={(e) => handleInputChange(key, e.target.value)}
            />
            <Checkbox
              className="ml-2"
              checked={!!values[key as keyof typeof values]}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-4">
        <Button
          variant="outline"
          className="flex flex-nowrap items-center gap-2"
          onClick={resetFields}
        >
          {t("Reset")}
        </Button>

        <Button
          onClick={handleApply}
          className="flex flex-nowrap items-center gap-2"
        >
          {t("Search")}
        </Button>
      </div>
    </div>
  )
}

const getPlaceholder = (key: string) => {
  const placeholders: { [key: string]: string } = {
    title: "Title",
    author: "Author",
    isbn: "ISBN",
    classificationNumber: "Classification number",
    genres: "Genres",
    publisher: "Publisher",
    topicalTerms: "Topical terms",
  }
  return placeholders[key] || ""
}

export default BasicSearchTab
