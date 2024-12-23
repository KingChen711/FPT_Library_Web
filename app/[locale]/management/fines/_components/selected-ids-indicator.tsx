"use client"

import React from "react"
import { useManagementFinesStore } from "@/stores/fines/use-management-fines"
import { CheckSquare, X } from "lucide-react"
import { useTranslations } from "next-intl"

function SelectedIdsIndicator() {
  const { selectedIds, clear } = useManagementFinesStore()
  const t = useTranslations("FinesManagementPage")

  if (selectedIds.length === 0) return null

  return (
    <div className="flex h-10 items-center justify-center gap-x-2 rounded-md bg-primary px-2 py-1 text-sm text-primary-foreground">
      <CheckSquare className="size-4" />
      {t("fines selected", {
        amount: selectedIds.length.toString(),
      })}
      <X className="size-4 cursor-pointer" onClick={() => clear()} />
    </div>
  )
}

export default SelectedIdsIndicator
