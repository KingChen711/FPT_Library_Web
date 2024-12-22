"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { type TGetEmployeesData } from "@/queries/employees/get-employees"
import { Loader2 } from "lucide-react"

import EmployeeSearch from "./user-filters/user-search"
import EmployeeTable from "./user-table"
import EmployeeDeleteRangeConfirm from "./user-table/user-delete-range-confirm"
import EmployeeHeaderTab from "./user-table/user-header-tab"
import EmployeeSoftDeleteRangeConfirm from "./user-table/user-soft-delete-range-confirm"
import EmployeeUndoDeleteRangeConfirm from "./user-table/user-undo-delete-range-confirm"

type EmployeeContainerProps = {
  tableData: TGetEmployeesData
}

const EmployeeContainer = ({ tableData }: EmployeeContainerProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const searchParams = useSearchParams()

  const isDeleted = searchParams.get("isDeleted")

  return (
    <div className="my-4 grid w-full">
      <div className="relative w-full overflow-x-auto rounded-lg bg-primary-foreground p-4">
        <div>
          <div className="flex items-center gap-4">
            <EmployeeSearch />
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
          <div className="rounded-md border">
            <Suspense fallback={<Loader2 className="animate-spin" />}>
              <EmployeeHeaderTab />
              <EmployeeTable
                tableData={tableData}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeContainer
