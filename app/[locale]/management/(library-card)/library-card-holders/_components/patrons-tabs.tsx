"use client"

import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useManagementPatronsStore } from "@/stores/patrons/use-management-patrons"
import { useTranslations } from "next-intl"

import { cn, formUrlQuery } from "@/lib/utils"

type Props = {
  tab: "Active" | "Deleted"
}

function PatronsTabs({ tab }: Props) {
  const t = useTranslations("LibraryCardManagementPage")
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clear } = useManagementPatronsStore()

  const handleChangeTab = (tab: "Active" | "Deleted") => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        tab,
        pageIndex: "1",
      },
    })
    clear()
    router.replace(newUrl, { scroll: false })
  }

  return (
    <div className="flex items-center">
      <div
        onClick={() => handleChangeTab("Active")}
        className={cn(
          "w-[120px] cursor-pointer border-b-2 px-4 py-2 text-center font-bold",
          tab === "Active" && "pointer-events-none border-primary text-primary"
        )}
      >
        {t("Active")}
      </div>

      <div
        onClick={() => handleChangeTab("Deleted")}
        className={cn(
          "w-[120px] cursor-pointer border-b-2 px-4 py-2 text-center font-bold",
          tab === "Deleted" && "pointer-events-none border-primary text-primary"
        )}
      >
        {t("Deleted")}
      </div>
    </div>
  )
}

export default PatronsTabs
