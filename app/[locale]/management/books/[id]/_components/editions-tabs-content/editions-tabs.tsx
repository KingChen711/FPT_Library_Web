"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"

type Props = {
  tab: "Active" | "Deleted"
  setTab: (tab: "Active" | "Deleted") => void
}

function EditionsTabs({ tab, setTab }: Props) {
  const t = useTranslations("BooksManagementPage")

  return (
    <div className="flex items-center">
      <div
        onClick={() => setTab("Active")}
        className={cn(
          "w-28 cursor-pointer border-b-2 px-4 py-2 text-center font-bold",
          tab === "Active" && "pointer-events-none border-primary text-primary"
        )}
      >
        {t("Active")}
      </div>
      <div
        onClick={() => setTab("Deleted")}
        className={cn(
          "w-28 cursor-pointer border-b-2 px-4 py-2 text-center font-bold",
          tab === "Deleted" && "pointer-events-none border-primary text-primary"
        )}
      >
        {t("Deleted")}
      </div>
    </div>
  )
}

export default EditionsTabs
