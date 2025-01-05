"use client"

import { useManagementEmployeesStore } from "@/stores/employees/use-management-employees"
import { CheckSquare, X } from "lucide-react"
import { useTranslations } from "next-intl"

function SelectedAuthorIdsIndicator() {
  const { selectedIds, clear } = useManagementEmployeesStore()
  const t = useTranslations("AuthorManagement")

  if (selectedIds.length === 0) return null

  return (
    <div className="flex h-10 items-center justify-center gap-x-2 rounded-md bg-primary px-2 py-1 text-sm text-primary-foreground">
      <CheckSquare className="size-4" />
      {t("Employees selected", {
        amount: selectedIds.length.toString(),
      })}
      <X className="size-4 cursor-pointer" onClick={() => clear()} />
    </div>
  )
}

export default SelectedAuthorIdsIndicator
