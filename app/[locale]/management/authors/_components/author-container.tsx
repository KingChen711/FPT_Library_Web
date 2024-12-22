"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import { type TGetAuthorsData } from "@/queries/authors/get-authors"
import { Loader2 } from "lucide-react"

import AuthorSearch from "./author-filters/author-search"
import AuthorTable from "./author-table"
import AuthorDeleteRangeConfirm from "./author-table/author-delete-range-confirm"
import AuthorHeaderTab from "./author-table/author-header-tab"
import AuthorSoftDeleteRangeConfirm from "./author-table/author-soft-delete-range-confirm"
import AuthorUndoDeleteRangeConfirm from "./author-table/author-undo-delete-range-confirm"

type AuthorContainerProps = {
  tableData: TGetAuthorsData
}

const AuthorContainer = ({ tableData }: AuthorContainerProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const searchParams = useSearchParams()

  const isDeleted = searchParams.get("isDeleted")

  return (
    <div className="my-4 grid w-full">
      <div className="relative w-full overflow-x-auto rounded-lg bg-primary-foreground p-4">
        <div>
          <div className="flex items-center gap-4">
            <AuthorSearch />
            {selectedIds.length > 1 &&
              (isDeleted === "true" ? (
                <div className="flex items-center gap-4">
                  <AuthorDeleteRangeConfirm selectedIds={selectedIds} />
                  <AuthorUndoDeleteRangeConfirm selectedIds={selectedIds} />
                </div>
              ) : (
                <AuthorSoftDeleteRangeConfirm selectedIds={selectedIds} />
              ))}
          </div>
          <div className="rounded-md border">
            <Suspense fallback={<Loader2 className="animate-spin" />}>
              <AuthorHeaderTab />
              <AuthorTable
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

export default AuthorContainer
