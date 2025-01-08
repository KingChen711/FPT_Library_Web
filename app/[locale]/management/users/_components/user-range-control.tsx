"use client"

import { useSearchParams } from "next/navigation"
import { useManagementUsersStore } from "@/stores/users/use-management-user"

import UserDeleteRangeConfirm from "./user-delete-range-confirm"
import UserSoftDeleteRangeConfirm from "./user-soft-delete-range-confirm"
import UserUndoDeleteRangeConfirm from "./user-undo-delete-range-confirm"

const UserRangeControl = () => {
  const searchParams = useSearchParams()
  const { selectedIds } = useManagementUsersStore()
  const isDeleted = searchParams.get("isDeleted")

  return (
    <div>
      {selectedIds.length > 0 &&
        (isDeleted === "true" ? (
          <div className="flex items-center gap-4">
            <UserDeleteRangeConfirm selectedIds={selectedIds} />
            <UserUndoDeleteRangeConfirm selectedIds={selectedIds} />
          </div>
        ) : (
          <UserSoftDeleteRangeConfirm selectedIds={selectedIds} />
        ))}
    </div>
  )
}

export default UserRangeControl
