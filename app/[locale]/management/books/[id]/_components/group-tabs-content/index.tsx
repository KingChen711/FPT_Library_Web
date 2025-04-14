"use client"

import React, { useState } from "react"

import useGroupItems, {
  type TSearchGroupItemsSchema,
} from "@/hooks/books/use-group-items"
import LibraryItemCard from "@/components/ui/book-card"
import Paginator from "@/components/ui/paginator"
import { TabsContent } from "@/components/ui/tabs"

type Props = {
  bookId: number
}

const initSearchParams: TSearchGroupItemsSchema = {
  pageIndex: 1,
  pageSize: "5",
  search: "",
}

function GroupTabsContent({ bookId }: Props) {
  const [searchParams, setSearchParams] =
    useState<TSearchGroupItemsSchema>(initSearchParams)

  const { data } = useGroupItems(bookId, searchParams)

  return (
    <TabsContent value="group">
      <div className="space-y-6">
        {data && data.sources.length > 0 && (
          <>
            {data.sources.map((item) => (
              <LibraryItemCard
                key={item.libraryItemId}
                expandable
                libraryItem={item}
                className="max-w-full"
              />
            ))}
            <Paginator
              pageSize={+searchParams.pageSize}
              pageIndex={searchParams.pageIndex}
              totalPage={data.totalPage}
              totalActualItem={data.totalActualItem}
              className="mt-6"
              onPaginate={(page) =>
                setSearchParams((prev) => ({
                  ...prev,
                  pageIndex: page,
                }))
              }
              onChangePageSize={(size) =>
                setSearchParams((prev) => ({
                  ...prev,
                  pageSize: size,
                }))
              }
            />
          </>
        )}
      </div>
    </TabsContent>
  )
}

export default GroupTabsContent
