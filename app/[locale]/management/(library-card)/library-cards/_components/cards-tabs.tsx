"use client"

import React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

import { cn, formUrlQuery } from "@/lib/utils"

type Props = {
  tab: "Active" | "Archived"
}

function CardsTabs({ tab }: Props) {
  const t = useTranslations("LibraryCardManagementPage")
  const searchParams = useSearchParams()
  const router = useRouter()

  const handleChangeTab = (tab: "Active" | "Archived") => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      updates: {
        tab,
        pageIndex: "1",
      },
    })

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
        onClick={() => handleChangeTab("Archived")}
        className={cn(
          "w-[120px] cursor-pointer border-b-2 px-4 py-2 text-center font-bold",
          tab === "Archived" &&
            "pointer-events-none border-primary text-primary"
        )}
      >
        {t("Archived")}
      </div>
    </div>
  )
}

export default CardsTabs
