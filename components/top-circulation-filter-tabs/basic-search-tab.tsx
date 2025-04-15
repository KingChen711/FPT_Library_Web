import { type SetStateAction } from "react"
import { useTranslations } from "next-intl"

import { ESearchType } from "@/lib/types/enums"
import { type TSearchTopCirculation } from "@/lib/validations/books/search-top-circulation"
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
  setSearchParams: React.Dispatch<React.SetStateAction<TSearchTopCirculation>>
  values: TBasicSearch
  setValues: React.Dispatch<SetStateAction<TBasicSearch>>
}

const BasicSearchTab = ({ setValues, values, setSearchParams }: Props) => {
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
  }

  const handleApply = () => {
    setSearchParams((prev) => ({
      ...prev,
      values,
      pageIndex: 1,
      searchType: ESearchType.BASIC_SEARCH.toString(),
      search: "",
    }))
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
