"use client"

import { useMemo, useState } from "react"
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

import { type TSearchTopCirculation } from "@/lib/validations/books/search-top-circulation"
import { filterEnumSchema } from "@/lib/zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import AdvancedSearchTab from "./advance-search-tab"
import BasicSearchTab, { type TBasicSearch } from "./basic-search-tab"

export type FOV = {
  id: string
  f: EAdvancedFilterLibraryItemField | null
  o: EFilterOperator | null
  v: string | number | [Date | null, Date | null] | null
}

type Props = {
  searchParams: TSearchTopCirculation
  setSearchParams: React.Dispatch<React.SetStateAction<TSearchTopCirculation>>
}

const TopCirculationFilterTabs = ({ searchParams, setSearchParams }: Props) => {
  const t = useTranslations("BasicSearchTab")

  //Basic search
  const [basicSearchValues, setBasicSearchValues] = useState<TBasicSearch>({
    title: searchParams.title || "",
    author: searchParams.author || "",
    isbn: searchParams.isbn || "",
    classificationNumber: searchParams.classificationNumber || "",
    genres: searchParams.genres || "",
    publisher: searchParams.publisher || "",
    topicalTerms: searchParams.topicalTerms || "",
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
        .parse(searchParams.f),
    [searchParams]
  )

  const os = useMemo(
    () =>
      z
        .array(filterEnumSchema(EFilterOperator))
        .transform((data) => (data.some((i) => i === undefined) ? [] : data))
        .catch([])
        .parse(searchParams.o),
    [searchParams]
  )

  const vs = useMemo(() => searchParams.v, [searchParams])

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
      <Tabs defaultValue={"basic-search"}>
        <TabsList className="w-full">
          <TabsTrigger className="flex-1" value="basic-search">
            {t("Basic search")}
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="advanced-search">
            {t("Advanced search")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="quick-search"></TabsContent>
        <TabsContent value="basic-search">
          <BasicSearchTab
            setSearchParams={setSearchParams}
            values={basicSearchValues}
            setValues={setBasicSearchValues}
          />
        </TabsContent>
        <TabsContent value="advanced-search">
          <AdvancedSearchTab
            setSearchParams={setSearchParams}
            queries={queries}
            setQueries={setQueries}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default TopCirculationFilterTabs
