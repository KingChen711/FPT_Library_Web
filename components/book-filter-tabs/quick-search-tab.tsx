import { useEffect, useState, type SetStateAction } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { useDebounce } from "use-debounce"

import { ESearchType } from "@/lib/types/enums"
import { cn, formUrlQuery } from "@/lib/utils"
import useAutoCompleteBooks from "@/hooks/books/use-auto-complete-books"
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

import LibraryItemCard from "../ui/book-card"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"

type Props = {
  keywordValue: string
  setKeywordValue: React.Dispatch<SetStateAction<string>>
  searchWithSpecial: boolean
  setSearchWithSpecial: React.Dispatch<SetStateAction<boolean>>
  isMatchExact: boolean
  setIsMatchExact: React.Dispatch<SetStateAction<boolean>>
  searchValue: string
  setSearchValue: React.Dispatch<SetStateAction<string>>
  autoComplete?: boolean
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
  autoComplete = false,
}: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations("BasicSearchTab")

  const [suggestion, setSuggestion] = useState("")
  const [debouncedSearchTerm] = useDebounce(searchValue, 300)

  const { data: autoCompleteData } = useAutoCompleteBooks(
    debouncedSearchTerm,
    autoComplete
  )

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

  useEffect(() => {
    if (!searchValue) return setSuggestion("")
    const match = autoCompleteData?.find((s) =>
      s.title.toLowerCase().startsWith(searchValue.toLowerCase())
    )

    setSuggestion(
      match && match.title !== searchValue
        ? match.title.slice(searchValue.length)
        : ""
    )
  }, [autoCompleteData, searchValue])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && suggestion) {
      e.preventDefault()
      setSearchValue(searchValue + suggestion)
      setSuggestion("")
    }
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

        <div className="relative w-full">
          <Input
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value)
            }}
            onKeyDown={handleKeyDown}
            className="peer flex-1"
            placeholder={`${t("Search")}...`}
          />

          {suggestion && (
            <span className="pointer-events-none absolute top-1/2 ml-[13px] hidden -translate-y-1/2 overflow-hidden text-nowrap pr-3 text-sm text-muted-foreground peer-focus:inline">
              <span className="text-transparent">{searchValue}</span>
              <span className="text-muted-foreground">{suggestion}</span>
            </span>
          )}

          {autoCompleteData && autoCompleteData.length > 0 && (
            <div
              className={cn(
                "absolute left-0 top-[calc(100%+4px)] !z-[10000] flex w-full max-w-[500px] flex-col overflow-hidden rounded-md border bg-muted"
              )}
            >
              {autoCompleteData.map((acd) => (
                <TooltipProvider key={acd.libraryItemId}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={`/books/${acd.libraryItemId}`}
                        key={acd.libraryItemId}
                        className="group z-0 flex items-center gap-2 px-2 py-1 hover:bg-background"
                      >
                        {acd.coverImage ? (
                          <Image
                            width={72}
                            height={108}
                            src={acd.coverImage}
                            alt={acd.title}
                            className="h-9 w-6 shrink-0 rounded-sm border object-cover"
                          />
                        ) : (
                          <div className="h-9 w-6 shrink-0 bg-transparent"></div>
                        )}
                        <div className="flex flex-1 flex-col">
                          <div className={cn("line-clamp-1 text-sm font-bold")}>
                            {acd.title}
                          </div>
                          <div
                            className={cn(
                              "line-clamp-1 text-xs italic text-muted-foreground"
                            )}
                          >
                            {acd.subTitle}
                          </div>
                        </div>
                        {/* <Badge
                          className="flex w-[92px] shrink-0 justify-center"
                          variant={acd.available ? "success" : "warning"}
                        >
                          {tAutocomplete(
                            acd.available ? "Available" : "Out of shelf"
                          )}
                        </Badge> */}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      className="z-10 bg-card p-0 text-card-foreground"
                    >
                      <LibraryItemCard
                        className="max-w-[calc(98vw-952px)]"
                        libraryItem={acd}
                      />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          )}
        </div>
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
