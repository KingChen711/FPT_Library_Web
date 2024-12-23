"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { type TGetUSersData } from "@/queries/users/get-users"
import { Loader2 } from "lucide-react"

import UserSearch from "./user-filters/user-search"
import UserTable from "./user-table"
import UserDeleteRangeConfirm from "./user-table/user-delete-range-confirm"
import UserHeaderTab from "./user-table/user-header-tab"
import UserSoftDeleteRangeConfirm from "./user-table/user-soft-delete-range-confirm"
import UserUndoDeleteRangeConfirm from "./user-table/user-undo-delete-range-confirm"

type UserContainerProps = {
  tableData: TGetUSersData
}

const UserContainer = ({ tableData }: UserContainerProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const searchParams = useSearchParams()

  const isDeleted = searchParams.get("isDeleted")

  return (
    <div className="my-4 grid w-full">
      <div className="relative w-full overflow-x-auto rounded-lg bg-primary-foreground p-4">
        <div>
          <div className="flex items-center gap-4">
            <UserSearch />
            {selectedIds.length > 1 &&
              (isDeleted === "true" ? (
                <div className="flex items-center gap-4">
                  <UserDeleteRangeConfirm selectedIds={selectedIds} />
                  <UserUndoDeleteRangeConfirm selectedIds={selectedIds} />
                </div>
              ) : (
                <UserSoftDeleteRangeConfirm selectedIds={selectedIds} />
              ))}
          </div>
          <div className="rounded-md border">
            <Suspense fallback={<Loader2 className="animate-spin" />}>
              <UserHeaderTab />
              <UserTable
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

export default UserContainer
