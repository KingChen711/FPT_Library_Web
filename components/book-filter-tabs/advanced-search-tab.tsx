"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  advancedFilters,
  EAdvancedFilterType,
  type EAdvancedFilterBookField,
} from "@/constants/advanced-filter.constants"
import { format } from "date-fns"
import { Plus } from "lucide-react"
import { useTranslations } from "next-intl"
import { v4 as uuidv4 } from "uuid"

import { ESearchType, type EFilterOperator } from "@/lib/types/enums"
import { formUrlQuery } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import AdvancedSearchItem from "./advanced-search-item"

export type FOV = {
  id: string
  f: EAdvancedFilterBookField | null
  o: EFilterOperator | null
  v: string | number | [string | null, string | null]
}

const AdvancedSearchTab = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations("BooksManagementPage")
  const [bookQueries, setBookQueries] = useState<FOV[]>(() => {
    const f = searchParams.getAll("f")
    const o = searchParams.getAll("o")
    const v = searchParams.getAll("v")

    if (f.length !== o.length || f.length !== v.length) return []

    return f.map((_, i) => {
      const type =
        advancedFilters.find(
          (a) => a.field === (f[i] as EAdvancedFilterBookField)
        )?.type || EAdvancedFilterType.TEXT

      let value: string | number | [string | null, string | null] = ""

      switch (type) {
        case EAdvancedFilterType.TEXT:
          value = v[i]
          break
        case EAdvancedFilterType.NUMBER:
          value = +v[i]
          break
        case EAdvancedFilterType.ENUM:
          value = +v[i]
          break
        case EAdvancedFilterType.DATE:
          value = v[i]
            .split(",")
            .map((d) => (!d || d === "null" ? null : d)) as [
            string | null,
            string | null,
          ]
          break
      }

      return {
        id: uuidv4(),
        f: f[i] as EAdvancedFilterBookField,
        o: +o[i] as unknown as EFilterOperator | null,
        v: value,
      }
    })
  })

  const selectedFields = bookQueries
    .map((item) => item.f)
    .filter(Boolean) as EAdvancedFilterBookField[]

  useEffect(() => {
    console.log({ bookQueries })
  }, [bookQueries])

  const handleNewFov = () =>
    setBookQueries((prev) => [
      ...prev,
      { id: uuidv4(), f: null, o: null, v: "" },
    ])

  const handleDeleteFov = (id: string) =>
    setBookQueries((prev) => prev.filter((f) => f.id !== id))

  const handleChangeFov = (id: string, fov: FOV) => {
    setBookQueries((prev) => prev.map((item) => (item.id === id ? fov : item)))
  }

  const handleApply = () => {
    if (bookQueries.length === 0) return
    const filteredQuery = bookQueries
      .filter(
        (f) =>
          f.v !== "" && JSON.stringify(f.v) !== JSON.stringify([null, null])
      )
      .map((f) => {
        if (Array.isArray(f.v)) {
          return {
            ...f,
            v: f.v
              .map((a) =>
                a === null ? "null" : format(new Date(a), "yyyy-MM-dd")
              )
              .join(","),
            id: undefined,
          }
        }
        return { ...f, id: undefined }
      })

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        f: filteredQuery.map((f) => f.f),
        o: filteredQuery.map((f) => (f.o === null ? "null" : f.o.toString())),
        v: filteredQuery.map((f) => f.v.toString()),
        pageIndex: "1",
        searchType: ESearchType.ADVANCED_SEARCH.toString(),
        search: null,
      },
    }).replace(window.location.pathname, "/books")

    router.push(newUrl)
  }

  return (
    <div className="space-y-4">
      {bookQueries.map((fov) => (
        <AdvancedSearchItem
          onDeleteFov={handleDeleteFov}
          key={fov.id}
          fov={fov}
          selectedFields={selectedFields}
          onChangeFov={handleChangeFov}
          onNewFov={handleNewFov}
        />
      ))}
      <div className="flex items-center justify-between">
        <Button onClick={handleNewFov} className="flex items-center gap-2">
          <Plus />
          {t("Add new")}
        </Button>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setBookQueries([])}
            variant="outline"
            className="flex items-center gap-2"
          >
            {t("Reset")}
          </Button>
          <Button
            onClick={handleApply}
            variant="default"
            className="flex items-center gap-2"
          >
            {t("Apply")}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AdvancedSearchTab
