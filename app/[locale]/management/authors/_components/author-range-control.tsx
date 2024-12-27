"use client"

import React from "react"
import { useSearchParams } from "next/navigation"
import { useManagementEmployeesStore } from "@/stores/employees/use-management-employees"

import EmployeeDeleteRangeConfirm from "./author-delete-range-confirm"
import EmployeeSoftDeleteRangeConfirm from "./author-soft-delete-range-confirm"
import EmployeeUndoDeleteRangeConfirm from "./author-undo-delete-range-confirm"

const EmployeeRangeControl = () => {
  const searchParams = useSearchParams()
  const { selectedIds } = useManagementEmployeesStore()
  const isDeleted = searchParams.get("isDeleted")

  return (
    <div>
      {selectedIds.length > 1 &&
        (isDeleted === "true" ? (
          <div className="flex items-center gap-4">
            <EmployeeDeleteRangeConfirm selectedIds={selectedIds} />
            <EmployeeUndoDeleteRangeConfirm selectedIds={selectedIds} />
          </div>
        ) : (
          <EmployeeSoftDeleteRangeConfirm selectedIds={selectedIds} />
        ))}
    </div>
  )
}

export default EmployeeRangeControl
