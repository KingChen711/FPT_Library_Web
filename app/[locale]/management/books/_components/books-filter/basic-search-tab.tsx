import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

import { ESearchType } from "@/lib/types/enums"
import { formUrlQuery } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

type Props = {
  isTrained: boolean | undefined
}

const BasicSearchTab = ({ isTrained }: Props) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const t = useTranslations("BasicSearchTab")
  const [values, setValues] = useState({
    title: searchParams.get("title") || "",
    author: searchParams.get("author") || "",
    isbn: searchParams.get("isbn") || "",
    classificationNumber: searchParams.get("classificationNumber") || "",
    genres: searchParams.get("genres") || "",
    publisher: searchParams.get("publisher") || "",
    topicalTerms: searchParams.get("topicalTerms") || "",
  })

  const handleInputChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const resetFields = () => {
    setValues({
      title: "",
      author: "",
      isbn: "",
      classificationNumber: "",
      genres: "",
      publisher: "",
      topicalTerms: "",
    })
  }

  const handleApply = () => {
    if (Object.values(values).every((a) => a === "")) return

    const searchValues = structuredClone(values)
    Object.keys(searchValues).forEach((k) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      searchValues[k] = searchValues[k] === "" ? undefined : searchValues[k]
    })
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        ...searchValues,
        pageIndex: "1",
        searchType: ESearchType.BASIC_SEARCH.toString(),
        search: null,
        isTrained:
          isTrained === undefined ? null : isTrained ? "true" : "false",
      },
    }).replace(window.location.pathname, "/management/books")

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
    topicalTerms: "Keyword",
  }
  return placeholders[key] || ""
}

export default BasicSearchTab
