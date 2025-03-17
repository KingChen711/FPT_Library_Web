import Image from "next/image"
import { Link } from "@/i18n/routing"
import NoImage from "@/public/assets/images/no-image.png"
import getLibraryItemByCategory from "@/queries/library-item/get-libraryItem-by-category"
import { User2 } from "lucide-react"

import { getTranslations } from "@/lib/get-translations"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

type Props = {
  categoryId: number
  title: string
}

const BookList = async ({ title, categoryId }: Props) => {
  const t = await getTranslations("HomePage")

  const libraryItems = await getLibraryItemByCategory(categoryId, {
    pageSize: "5",
    pageIndex: 1,
    search: "",
  })

  if (!libraryItems)
    return (
      <Card className="flex h-[420px] flex-col overflow-hidden rounded-lg shadow-md">
        {/* Skeleton cho ảnh bìa */}
        <div className="flex h-3/4 items-center justify-center p-4">
          <Skeleton className="h-[240px] w-[180px] rounded-lg" />
        </div>

        {/* Skeleton cho nội dung */}
        <div className="flex flex-col gap-2 p-3">
          <Skeleton className="h-5 w-3/4" />
          <div className="flex justify-between gap-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <div className="flex justify-between gap-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
          <Skeleton className="h-4 w-2/3" />
        </div>
      </Card>
    )

  if (libraryItems.sources.length === 0) return null

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <Label className="text-2xl font-bold text-foreground">
          {title} &nbsp;
          <span className="text-lg text-muted-foreground">
            ({libraryItems.sources.length} {t("books")})
          </span>
        </Label>
      </div>

      <div className="mt-6 grid w-full gap-6 md:grid-cols-3 lg:grid-cols-5">
        {libraryItems.sources.map((item) => (
          <Card
            key={item.libraryItemId}
            className="group flex h-[420px] flex-col overflow-hidden rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
          >
            {/* Ảnh bìa */}
            <div className="relative flex h-3/4 items-center justify-center p-4">
              <Image
                src={item.coverImage || NoImage.src}
                alt={item.title}
                width={180}
                height={240}
                priority
                unoptimized
                className="rounded-lg object-contain"
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
          </Card>
        ))}
      </div>
    </div>
  )
}

export default BookList
