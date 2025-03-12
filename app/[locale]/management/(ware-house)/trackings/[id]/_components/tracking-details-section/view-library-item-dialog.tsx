"use client"

import React from "react"
import { Loader2 } from "lucide-react"

import useLibraryItem from "@/hooks/library-items/use-library-item"
import LibraryItemCard from "@/components/ui/book-card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import NoData from "@/components/ui/no-data"

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
  libraryItemId: number
}

function ViewLibraryItemDialog({ libraryItemId, open, setOpen }: Props) {
  const { data, isFetching } = useLibraryItem(libraryItemId, open)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-fit max-w-[95vw]">
        {isFetching ? (
          <div className="flex size-24 items-center justify-center">
            <Loader2 className="size-9 animate-spin" />
          </div>
        ) : data ? (
          <LibraryItemCard
            modal
            libraryItem={{
              ...data,
              libraryItemAuthors: data.authors.map((author, i) => ({
                ...(data.libraryItemAuthors?.[i] || {}),
                author,
              })),
            }}
          />
        ) : (
          <NoData />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ViewLibraryItemDialog
