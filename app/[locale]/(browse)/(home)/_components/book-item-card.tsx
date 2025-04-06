"use client"

import Image from "next/image"
import { useRouter } from "@/i18n/routing"
import NoImage from "@/public/assets/images/no-image.png"
import { User2 } from "lucide-react"
import { useTranslations } from "next-intl"

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
  libraryItem: number
}

const BookItemCard = ({ libraryItem }: Props) => {
  const router = useRouter()
  const t = useTranslations("HomePage")
  const { data: item, isLoading } = useLibraryItemDetail(libraryItem)

  if (isLoading) {
    return <BrowseBookCardSkeleton />
  }

  if (!item) {
    return null
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="w-full">
            <Card onClick={() => router.push(`/books/${item.libraryItemId}`)}>
              <div className="relative flex w-full items-center justify-center overflow-hidden rounded-t-md p-4">
                <Image
                  src={item.coverImage || NoImage.src}
                  alt={item.title}
                  height={360}
                  width={240}
                  className="aspect-[2/3] h-[240px] w-[160px] rounded-md object-cover"
                />
              </div>

              <div className="p-2 text-left text-sm">
                <div className="line-clamp-1 text-sm font-semibold group-hover:text-primary">
                  {item.title}
                </div>
                <div className="flex items-center justify-between">
                  {item.authors.length > 0 && (
                    <div className="flex flex-1 items-center gap-1 overflow-hidden">
                      <User2 size={16} className="text-primary" />

                      <span className="line-clamp-1 text-xs">
                        {item.authors[0]?.fullName}
                      </span>
                    </div>
                  )}
                  <p className="line-clamp-1 flex items-center gap-1 text-sm">
                    {item.publicationYear}
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
                    {item.pageCount} {t("pages")}
                  </p>
                </div>
                <p className="line-clamp-1 text-xs font-semibold">
                  {item.publisher}
                </p>
              </div>
            </Card>
          </TooltipTrigger>
          <TooltipContent align="start" side="right">
            <BookTooltip libraryItem={item} />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  )
}

export default BookItemCard
