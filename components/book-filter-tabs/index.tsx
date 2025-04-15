"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import {
  EAdvancedFilterType,
  EFilterOperator,
} from "@/constants/advance-search/common"
import {
  EAdvancedFilterLibraryItemField,
  libraryItemAdvancedFilters,
} from "@/constants/advanced-filter-library-items"
import { isValid, parse } from "date-fns"
import { useTranslations } from "next-intl"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

import { filterBooleanSchema, filterEnumSchema } from "@/lib/zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Label } from "../ui/label"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import AdvancedSearchTab from "./advance-search-tab"
import BasicSearchTab, { type TBasicSearch } from "./basic-search-tab"
import QuickSearchTab from "./quick-search-tab"

export type FOV = {
  id: string
  f: EAdvancedFilterLibraryItemField | null
  o: EFilterOperator | null
  v: string | number | [Date | null, Date | null] | null
}

type Props = {
  management?: boolean
  isTrained?: boolean
  canBorrow?: boolean
  autoComplete?: boolean
}

const BookFilterTabs = ({
  management = false,
  canBorrow: initCanBorrow,
  isTrained: initIsTrained,
  autoComplete = false,
}: Props) => {
  const t = useTranslations("BasicSearchTab")
  const searchParams = useSearchParams()

  const [isTrained, setIsTrained] = useState(initIsTrained)

  const [canBorrow, setCanBorrow] = useState(initCanBorrow)

  //Quick search
  const [keywordValue, setKeywordValue] = useState<string>(() =>
    z
      .enum(["0", "1", "2", "3", "4", "5", "6", "quick"])
      .catch("quick")
      .parse(searchParams.get("searchWithKeyword"))
  )
  const [searchWithSpecial, setSearchWithSpecial] = useState(
    filterBooleanSchema("true").parse(searchParams.get("searchWithSpecial"))!
  )

  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  )

  //Basic search
  const [basicSearchValues, setBasicSearchValues] = useState<TBasicSearch>({
    title: searchParams.get("title") || "",
    author: searchParams.get("author") || "",
    isbn: searchParams.get("isbn") || "",
    classificationNumber: searchParams.get("classificationNumber") || "",
    genres: searchParams.get("genres") || "",
    publisher: searchParams.get("publisher") || "",
    topicalTerms: searchParams.get("topicalTerms") || "",
  })

  //Advance search
  const fs = useMemo(
    () =>
      z
        .array(
          filterEnumSchema(EAdvancedFilterLibraryItemField, undefined, true)
        )
        .transform((data) => (data.some((i) => i === undefined) ? [] : data))
        .catch([])
        .parse(searchParams.getAll("f")),
    [searchParams]
  )

  const os = useMemo(
    () =>
      z
        .array(filterEnumSchema(EFilterOperator))
        .transform((data) => (data.some((i) => i === undefined) ? [] : data))
        .catch([])
        .parse(searchParams.getAll("o")),
    [searchParams]
  )

  const vs = useMemo(() => searchParams.getAll("v"), [searchParams])

  const [queries, setQueries] = useState<FOV[]>(() => {
    if (
      fs.length !== os.length ||
      fs.length !== vs.length ||
      [fs.length, os.length, vs.length].some((l) => l === 0)
    )
      return []

    return fs.map((f, i) => {
      const type = libraryItemAdvancedFilters.find((a) => a.field === f)!.type

      let value: string | number | [Date | null, Date | null] | null = ""

      switch (type) {
        case EAdvancedFilterType.TEXT:
          value = vs[i] || null
          break
        case EAdvancedFilterType.NUMBER:
          value = Number(vs[i]) || null
          break
        case EAdvancedFilterType.SELECT_STATIC:
          value = Number(vs[i]) || null
          break
        case EAdvancedFilterType.SELECT_DYNAMIC:
          value = Number(vs[i]) || null
          break
        case EAdvancedFilterType.DATE:
          const range = vs[i].split(",")
          if (range.length !== 2) {
            value = [null, null]
            break
          }
          value = range.map((date) => {
            if (date === "null" || !date) return null
            const parsedDate = parse(date.toString(), "yyyy-MM-dd", new Date())
            return isValid(parsedDate) ? parsedDate : null
          }) as [Date | null, Date | null]
          break
        default:
      }

      return {
        id: uuidv4(),
        f: f as EAdvancedFilterLibraryItemField,
        o: type === EAdvancedFilterType.DATE ? 0 : os[i] ? +os[i] : null,
        v: value,
      }
    }) as FOV[]
  })

  return (
    <div className="space-y-4">
      {management && (
        <>
          <div className="space-y-3">
            <Label>Train AI</Label>
            <RadioGroup
              value={
                isTrained === undefined
                  ? "all"
                  : isTrained
                    ? "trained"
                    : "untrained"
              }
              onValueChange={(value) => {
                setIsTrained(
                  value === "all"
                    ? undefined
                    : value === "trained"
                      ? true
                      : false
                )
              }}
              className="flex flex-row gap-4"
            >
              <div className="flex items-center space-x-3 space-y-0">
                <RadioGroupItem value="all" />
                <Label className="font-normal">{t("All2")}</Label>
              </div>
              <div className="flex items-center space-x-3 space-y-0">
                <RadioGroupItem value="trained" />
                <Label className="font-normal">{t("Trained")}</Label>
              </div>
              <div className="flex items-center space-x-3 space-y-0">
                <RadioGroupItem value="untrained" />
                <Label className="font-normal">{t("Untrained")}</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>{t("Can borrow")}</Label>
            <RadioGroup
              value={
                canBorrow === undefined
                  ? "all"
                  : canBorrow
                    ? "canBorrow"
                    : "cannotBorrow"
              }
              onValueChange={(value) => {
                setCanBorrow(
                  value === "all"
                    ? undefined
                    : value === "canBorrow"
                      ? true
                      : false
                )
              }}
              className="flex flex-row gap-4"
            >
              <div className="flex items-center space-x-3 space-y-0">
                <RadioGroupItem value="all" />
                <Label className="font-normal">{t("All2")}</Label>
              </div>
              <div className="flex items-center space-x-3 space-y-0">
                <RadioGroupItem value="canBorrow" />
                <Label className="font-normal">{t("Can borrow")}</Label>
              </div>
              <div className="flex items-center space-x-3 space-y-0">
                <RadioGroupItem value="cannotBorrow" />
                <Label className="font-normal">{t("Cannot borrow")}</Label>
              </div>
            </RadioGroup>
          </div>
        </>
      )}
      <Tabs defaultValue={management ? "basic-search" : "quick-search"}>
        <TabsList className="w-full">
          {!management && (
            <TabsTrigger className="flex-1" value="quick-search">
              {t("Quick search")}
            </TabsTrigger>
          )}
          <TabsTrigger className="flex-1" value="basic-search">
            {t("Basic search")}
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="advanced-search">
            {t("Advanced search")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="quick-search">
          {!management && (
            <QuickSearchTab
              autoComplete={autoComplete}
              keywordValue={keywordValue}
              searchValue={searchValue}
              searchWithSpecial={searchWithSpecial}
              setKeywordValue={setKeywordValue}
              setSearchValue={setSearchValue}
              setSearchWithSpecial={setSearchWithSpecial}
            />
          )}
        </TabsContent>
        <TabsContent value="basic-search">
          <BasicSearchTab
            management={management}
            values={basicSearchValues}
            setValues={setBasicSearchValues}
            canBorrow={canBorrow}
            setCanBorrow={setCanBorrow}
            isTrained={isTrained}
            setIsTrained={setIsTrained}
          />
        </TabsContent>
        <TabsContent value="advanced-search">
          <AdvancedSearchTab
            management={management}
            queries={queries}
            setQueries={setQueries}
            canBorrow={canBorrow}
            setCanBorrow={setCanBorrow}
            isTrained={isTrained}
            setIsTrained={setIsTrained}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default BookFilterTabs
