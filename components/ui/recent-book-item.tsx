import React from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { User2 } from "lucide-react"

import useLibraryItemDetail from "@/hooks/library-items/use-library-item-detail"

import { Card } from "./card"
import { Icons } from "./icons"
import NoData from "./no-data"

type Props = {
  libraryItem: string
  key: string
}

const RecentBookItem = ({ libraryItem }: Props) => {
  const { data: item, isLoading } = useLibraryItemDetail(libraryItem)
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!item) {
    return <NoData />
  }

  return (
    <Card
      key={item.libraryItemId}
      className="group flex h-[420px] flex-col overflow-hidden rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
    >
      {/* Ảnh bìa */}
      <div className="relative flex h-3/4 items-center justify-center p-4">
        <Image
          src={item.coverImage || "/placeholder.svg"}
          alt={item.title}
          width={180}
          height={240}
          priority
          unoptimized
          className="object-contain transition-transform duration-200 group-hover:scale-105"
        />
      </div>

      {/* Nội dung sách */}
      <div className="flex flex-col gap-1 p-3">
        <Link
          href={`/books/${item.libraryItemId}`}
          className="truncate font-semibold hover:text-primary"
        >
          {item.title}
        </Link>
        <div className="flex items-center justify-between gap-2">
          {item.authors.length > 0 ? (
            <p className="flex items-center gap-1 truncate text-sm">
              <User2 size={16} className="text-primary" /> by &nbsp;
              {item.authors[0]?.fullName}
            </p>
          ) : (
            <p></p>
          )}
          <p className="flex items-center gap-1 truncate text-sm">
            {item.publicationYear}
          </p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 text-sm font-semibold">
            <Icons.Star className="size-4 text-warning" />
            {item.avgReviewedRate || 5} / 5
          </div>
          <p className="text-xs">{item.pageCount} pages</p>
        </div>
        <p className="truncate text-xs font-semibold">{item.publisher}</p>
      </div>
    </Card>
  )
}

export default RecentBookItem
