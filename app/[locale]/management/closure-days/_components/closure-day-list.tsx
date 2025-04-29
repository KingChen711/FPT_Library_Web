"use client"

import React from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

import { type ClosureDay } from "@/lib/types/models"
import NoResult from "@/components/ui/no-result"
import SearchForm from "@/components/ui/search-form"
import { ClosureCard } from "@/components/closure-card"

import MutateClosureDayDialog from "./mutate-closure-day-dialog"

type Props = {
  closureDays: ClosureDay[]
}

function ClosureDayList({ closureDays }: Props) {
  const searchParams = useSearchParams()
  const search = searchParams.get("search") || ""
  const t = useTranslations("ClosureDaysManagementPage")

  // const filteredClosureDays = closureDays
  //   .filter(
  //     (closureDay) =>
  //       (locale === "vi" ? closureDay.vieDescription : closureDay.engDescription)
  //         .toLowerCase()
  //         .includes(debouncedSearchTerm.toLowerCase()) ||
  //       closureDay.prefix
  //         .toLowerCase()
  //         .includes(debouncedSearchTerm.toLowerCase())
  //   )
  //   .toSorted((a, b) => {
  //     switch (orderBy) {
  //       case "A-Z":
  //         return locale === "vi"
  //           ? a.vieDescription.localeCompare(b.vieDescription)
  //           : a.engDescription.localeCompare(b.engDescription)
  //       case "Z-A":
  //         return locale === "vi"
  //           ? b.vieDescription.localeCompare(a.vieDescription)
  //           : b.engDescription.localeCompare(a.engDescription)
  //       case "Id ascending":
  //         return a.closureDayId - b.closureDayId
  //       default:
  //         return b.closureDayId - a.closureDayId
  //     }
  //   })

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-4">
        <SearchForm className="h-10" search={search} />
        <MutateClosureDayDialog type="create" />
      </div>
      {closureDays.length === 0 && (
        <div className="flex justify-center p-4">
          <NoResult
            title={t("Closure days Not Found")}
            description={t(
              "No closure days matching your request were found Please check your information or try searching with different criteria"
            )}
          />
        </div>
      )}
      <div className="grid grid-cols-12 gap-4">
        {closureDays.map((closureDay) => (
          <ClosureCard key={closureDay.closureDayId} closureDay={closureDay} />
        ))}
      </div>
    </>
  )
}

export default ClosureDayList
