import { type SetStateAction } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

import { ESearchType } from "@/lib/types/enums"
import { formUrlQuery } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Props = {
  keywordValue: string
  setKeywordValue: React.Dispatch<SetStateAction<string>>
  searchWithSpecial: boolean
  setSearchWithSpecial: React.Dispatch<SetStateAction<boolean>>
  isMatchExact: boolean
  setIsMatchExact: React.Dispatch<SetStateAction<boolean>>
  searchValue: string
  setSearchValue: React.Dispatch<SetStateAction<string>>
}

const QuickSearchTab = ({
  isMatchExact,
  keywordValue,
  searchValue,
  searchWithSpecial,
  setIsMatchExact,
  setKeywordValue,
  setSearchValue,
  setSearchWithSpecial,
}: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations("BasicSearchTab")

  const resetFields = () => {
    setIsMatchExact(false)
    setKeywordValue("quick")
    setSearchValue("")
    setSearchWithSpecial(true)
  }

  const handleApply = () => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        pageIndex: "1",
        searchType: ESearchType.QUICK_SEARCH.toString(),
        isMatchExact: isMatchExact ? "true" : "false",
        searchWithSpecial: searchWithSpecial ? "true" : "false",
        searchWithKeyword: keywordValue === "quick" ? null : keywordValue,
        search: searchValue || "",
      },
    }).replace(window.location.pathname, "/search/result")

    router.push(newUrl)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Select
          value={keywordValue}
          onValueChange={(
            val: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "quick"
          ) => setKeywordValue(val)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Keywords" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="quick">{t("All")}</SelectItem>
            <SelectItem value="0">{t("Title")}</SelectItem>
            <SelectItem value="1">{t("Author")}</SelectItem>
            <SelectItem value="2">ISBN</SelectItem>
            <SelectItem value="3">{t("Classification number")}</SelectItem>
            <SelectItem value="4">{t("Genres")}</SelectItem>
            <SelectItem value="5">{t("Publisher")}</SelectItem>
            <SelectItem value="6">{t("Keyword")}</SelectItem>
          </SelectContent>
        </Select>

        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="flex-1"
          placeholder={`${t("Search")}...`}
        />
      </div>
      <div className="flex justify-between">
        <div className="flex flex-1 justify-start gap-8">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={searchWithSpecial}
              onCheckedChange={(val) => setSearchWithSpecial(Boolean(val))}
              id="search-no-mark"
            />
            <Label
              className="cursor-pointer font-normal"
              htmlFor="search-no-mark"
            >
              {t("Special character")}
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isMatchExact}
              onCheckedChange={(val) => setIsMatchExact(Boolean(val))}
              id="search-exact"
            />
            <Label
              className="cursor-pointer font-normal"
              htmlFor="search-exact"
            >
              {t("Match exact")}
            </Label>
          </div>
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
    </div>
  )
}

export default QuickSearchTab
