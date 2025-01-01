"use client"

import React from "react"
import { useManagementBookEditionsStore } from "@/stores/books/use-management-book-editions"
import { CheckSquare, X } from "lucide-react"
import { useTranslations } from "next-intl"

function SelectedIdsIndicator() {
  const { selectedIds, clear } = useManagementBookEditionsStore()
  const t = useTranslations("BooksManagementPage")

  if (selectedIds.length === 0) return null

  return (
    <div className="flex h-10 items-center justify-center gap-x-2 rounded-md bg-primary px-2 py-1 text-sm text-primary-foreground">
      <CheckSquare className="size-4" />
      {t("books selected", {
        amount: selectedIds.length.toString(),
      })}
      <X className="size-4 cursor-pointer" onClick={() => clear()} />
    </div>
  )
}

export default SelectedIdsIndicator
