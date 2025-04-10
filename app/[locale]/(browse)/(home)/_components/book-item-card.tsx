"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import NoImage from "@/public/assets/images/no-image.png"
import { User2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { type LibraryItem } from "@/lib/types/models"
import useLibraryItemDetail from "@/hooks/library-items/use-library-item-detail"
import BookTooltip from "@/components/ui/book-tooltip"
import BrowseBookCardSkeleton from "@/components/ui/browse-book-card"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Props = {
  id?: number
  item?: LibraryItem
  Wrapper?: React.ReactElement
} & (
  | {
      id: number
      item?: undefined
    }
  | {
      item: LibraryItem
      id?: undefined
    }
)

const BookItemCard = ({ item, id, Wrapper }: Props) => {
  const t = useTranslations("HomePage")

  const { data: queryItem, isLoading } = useLibraryItemDetail(id)

  const libraryItem = item || queryItem

  if (isLoading) {
    if (Wrapper)
      return React.cloneElement(Wrapper, {}, <BrowseBookCardSkeleton />)
    return <BrowseBookCardSkeleton />
  }

  if (!libraryItem) return null

  const content = (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="w-full">
          <Card>
            <Link href={`/books/${libraryItem.libraryItemId}`}>
              <div className="relative flex w-full items-center justify-center overflow-hidden rounded-t-md p-4">
                <Image
                  src={libraryItem.coverImage || NoImage.src}
                  alt={libraryItem.title}
                  height={540}
                  width={360}
                  className="aspect-[2/3] h-[270px] w-[180px] rounded-md object-fill"
                />
              </div>

              <div className="p-2 text-left text-sm">
                <div className="line-clamp-1 text-sm font-semibold group-hover:text-primary">
                  {libraryItem.title}
                </div>
                <div className="flex items-center justify-between">
                  {libraryItem.authors.length > 0 && (
                    <div className="flex flex-1 items-center gap-1 overflow-hidden">
                      <User2 size={16} className="text-primary" />

                      <span className="line-clamp-1 text-xs">
                        {libraryItem.authors[0]?.fullName}
                      </span>
                    </div>
                  )}
                  <p className="line-clamp-1 flex items-center gap-1 text-sm">
                    {libraryItem.publicationYear}
                  </p>
                </div>
                <div className="flex flex-row-reverse items-center justify-between gap-2">
                  {Number(item?.avgReviewedRate) > 0 && (
                    <div className="flex items-center gap-1 text-sm font-semibold">
                      <Icons.Star className="size-4 text-warning" />
                      {item?.avgReviewedRate} / 5
                    </div>
                  )}
                  <p className="text-xs">
                    {libraryItem.pageCount} {t("pages")}
                  </p>
                </div>
                <p className="line-clamp-1 text-xs font-semibold">
                  {libraryItem.publisher}
                </p>
              </div>
            </Link>
          </Card>
        </TooltipTrigger>
        <TooltipContent
          align="start"
          side="right"
          className="m-0 bg-card p-0 text-card-foreground"
        >
          <BookTooltip libraryItem={libraryItem} />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  if (Wrapper) return React.cloneElement(Wrapper, {}, content)
  return <>{content}</>
}

export default BookItemCard
