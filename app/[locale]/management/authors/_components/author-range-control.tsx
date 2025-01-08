"use client"

import { useSearchParams } from "next/navigation"
import { useManagementAuthorsStore } from "@/stores/authors/use-management-authors"

import AuthorDeleteRangeConfirm from "./author-delete-range-confirm"
import AuthorSoftDeleteRangeConfirm from "./author-soft-delete-range-confirm"
import AuthorUndoDeleteRangeConfirm from "./author-undo-delete-range-confirm"

const AuthorRangeControl = () => {
  const searchParams = useSearchParams()
  const { selectedIds } = useManagementAuthorsStore()
  const isDeleted = searchParams.get("isDeleted")

  return (
    <div>
      {selectedIds.length > 0 &&
        (isDeleted === "true" ? (
          <div className="flex items-center gap-4">
            <AuthorDeleteRangeConfirm selectedIds={selectedIds} />
            <AuthorUndoDeleteRangeConfirm selectedIds={selectedIds} />
          </div>
        ) : (
          <AuthorSoftDeleteRangeConfirm selectedIds={selectedIds} />
        ))}
    </div>
  )
}

export default AuthorRangeControl
