import Image from "next/image"
import { Link } from "@/i18n/routing"
import NoImage from "@/public/assets/images/no-image.png"
import { User2 } from "lucide-react"
import { useTranslations } from "next-intl"

import useLibraryItemDetail from "@/hooks/library-items/use-library-item-detail"
import { Skeleton } from "@/components/ui/skeleton"

import BrowseBookCardSkeleton from "./browse-book-card"
import { Card } from "./card"
import { Icons } from "./icons"

type Props = {
  libraryItem: string
  key: string
}

const RecentBookItem = ({ libraryItem }: Props) => {
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
      <Card className="group flex flex-col overflow-hidden rounded-md transition-all duration-200">
        <Link href={`/books/${item.libraryItemId}`}>
          {/* Ảnh bìa */}
          <div className="relative flex aspect-[2.1/3] flex-1 items-center justify-center overflow-hidden rounded-t-md p-4">
            <div className="absolute inset-0 z-0 overflow-hidden rounded-md p-4">
              <Skeleton className="size-full" />
            </div>
            <Image
              src={item.coverImage || NoImage.src}
              alt={item.title}
              width={360}
              height={480}
              className="z-[5] size-full overflow-hidden rounded-md border object-fill"
            />
          </div>

          {/* Nội dung sách */}
          <div className="flex shrink-0 flex-col gap-1 p-3 pt-0">
            <div className="truncate font-semibold group-hover:text-primary">
              {item.title}
            </div>
            <div className="flex items-center justify-between gap-2">
              {item.authors.length > 0 && (
                <p className="flex items-center gap-1 truncate text-sm">
                  <User2 size={16} className="text-primary" />
                  {item.authors[0]?.fullName}
                </p>
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
              <p className="text-xs">
                {item.pageCount} {t("pages")}
              </p>
            </div>
            <p className="truncate text-xs font-semibold">{item.publisher}</p>
          </div>
        </Link>
      </Card>
    </>
  )
}

export default RecentBookItem
