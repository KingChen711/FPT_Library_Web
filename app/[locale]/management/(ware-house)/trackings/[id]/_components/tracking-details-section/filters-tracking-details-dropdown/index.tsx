"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import {
  EAdvancedFilterType,
  EFilterOperator,
} from "@/constants/advance-search/common"
import {
  EAdvancedFilterTrackingDetailField,
  trackingDetailAdvancedFilters,
} from "@/constants/advanced-filter-tracking-details"
import { isValid, parse } from "date-fns"
import { Filter } from "lucide-react"
import { useTranslations } from "next-intl"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

import { filterEnumSchema } from "@/lib/zod"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import AdvancedSearchTab from "./advance-search-tab"
import BasicSearchTab from "./basic-search-tab"

type Props = {
  trackingId: number
  hasGlueBarcode: boolean | undefined
}

export type TBasicSearch = {
  itemName: string
  itemTotal: string
  unitPrice: string
  totalAmount: string
  stockTransactionType: string
  isbn: string
}

export type FOV = {
  id: string
  f: EAdvancedFilterTrackingDetailField | null
  o: EFilterOperator | null
  v: string | number | [Date | null, Date | null] | null
}

export function FiltersTrackingDetailsDropdown({
  trackingId,
  hasGlueBarcode: initHasGlueBarcode,
}: Props) {
  const t = useTranslations("BasicSearchTab")
  const [open, setOpen] = useState(false)
  const searchParams = useSearchParams()
  const [hasGlueBarcode, setHasGlueBarcode] = useState(initHasGlueBarcode)

  const [basicSearchValues, setBasicSearchValues] = useState<TBasicSearch>({
    itemName: searchParams.get("itemName") || "",
    itemTotal: searchParams.get("itemTotal") || "",
    unitPrice: searchParams.get("unitPrice") || "",
    totalAmount: searchParams.get("totalAmount") || "",
    stockTransactionType: searchParams.get("stockTransactionType") || "",
    isbn: searchParams.get("isbn") || "",
  })

  const fs = useMemo(
    () =>
      z
        .array(
          filterEnumSchema(EAdvancedFilterTrackingDetailField, undefined, true)
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
      const type = trackingDetailAdvancedFilters.find(
        (a) => a.field === f
      )!.type

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
        f: f as EAdvancedFilterTrackingDetailField,
        o: type === EAdvancedFilterType.DATE ? 0 : os[i] ? +os[i] : null,
        v: value,
      }
    }) as FOV[]
  })

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        className="flex cursor-pointer items-center gap-2 px-8"
        asChild
      >
        <Button
          variant="outline"
          className="h-full rounded-l-none border-input"
        >
          <Filter size={16} />
          {t("Filters")}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="mt-2 w-[650px] max-w-[calc(100vw-300px)] space-y-4 p-4"
      >
        <div className="space-y-3">
          <Label>{t("Has glue barcode")}</Label>
          <RadioGroup
            value={
              hasGlueBarcode === undefined
                ? "all"
                : hasGlueBarcode
                  ? "glued"
                  : "unglued"
            }
            onValueChange={(value) => {
              setHasGlueBarcode(
                value === "all" ? undefined : value === "glued" ? true : false
              )
            }}
            className="flex flex-row gap-4"
          >
            <div className="flex items-center space-x-3 space-y-0">
              <RadioGroupItem value="all" />
              <Label className="font-normal">{t("All2")}</Label>
            </div>
            <div className="flex items-center space-x-3 space-y-0">
              <RadioGroupItem value="glued" />
              <Label className="font-normal">{t("Glued")}</Label>
            </div>
            <div className="flex items-center space-x-3 space-y-0">
              <RadioGroupItem value="unglued" />
              <Label className="font-normal">{t("Unglued")}</Label>
            </div>
          </RadioGroup>
        </div>
        <Tabs defaultValue="basic-search">
          <TabsList className="w-full">
            {/* <TabsTrigger value="quick-search">{t("Quick search")}</TabsTrigger> */}
            <TabsTrigger className="flex-1" value="basic-search">
              {t("Basic search")}
            </TabsTrigger>
            <TabsTrigger className="flex-1" value="advanced-search">
              {t("Advanced search")}
            </TabsTrigger>
          </TabsList>
          {/* <TabsContent value="quick-search">
            <QuickSearchTab />
          </TabsContent> */}
          <TabsContent value="basic-search">
            <BasicSearchTab
              values={basicSearchValues}
              setValues={setBasicSearchValues}
              trackingId={trackingId}
              hasGlueBarcode={hasGlueBarcode}
              setHasGlueBarcode={setHasGlueBarcode}
              setOpen={setOpen}
            />
          </TabsContent>
          <TabsContent value="advanced-search">
            <AdvancedSearchTab
              queries={queries}
              setQueries={setQueries}
              trackingId={trackingId}
              hasGlueBarcode={hasGlueBarcode}
              setHasGlueBarcode={setHasGlueBarcode}
              setOpen={setOpen}
            />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
