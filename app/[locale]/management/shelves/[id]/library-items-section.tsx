"use client"

import React, { useState } from "react"
import { useTranslations } from "next-intl"

import { type BookEdition } from "@/lib/types/models"
import LibraryItemCard from "@/components/ui/book-card"
import Paginator from "@/components/ui/paginator"

type Props = {
  libraryItems: BookEdition[]
}

function LibraryItemSection({ libraryItems }: Props) {
  const t = useTranslations("BookPage")

  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState<"5" | "10" | "30" | "50" | "100">(
    "5"
  )

  const handlePaginate = (selectedPage: number) => {
    setPageIndex(selectedPage)
  }

  const handleChangePageSize = (size: "5" | "10" | "30" | "50" | "100") => {
    setPageSize(size)
  }

  const start = (pageIndex - 1) * +pageSize
  const end = start + +pageSize

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xl font-semibold">{t("Library items")}</h3>

      <div className="space-y-6">
        {libraryItems.slice(start, end).map((item) => (
          <LibraryItemCard
            key={item.libraryItemId}
            expandable
            libraryItem={item}
            className="max-w-full"
          />
        ))}
        <Paginator
          pageSize={+pageSize}
          pageIndex={pageIndex}
          totalPage={Math.ceil(libraryItems.length / +pageSize)}
          totalActualItem={libraryItems.length}
          className="mt-6"
          onPaginate={handlePaginate}
          onChangePageSize={handleChangePageSize}
        />
      </div>
    </div>
  )
}

export default LibraryItemSection
