import Image from "next/image"
import { Link } from "@/i18n/routing"
import NoImage from "@/public/assets/images/no-image.png"
import getLibraryItemByCategory from "@/queries/library-item/get-libraryItem-by-category"
import { User2 } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { Label } from "@/components/ui/label"

type Props = {
  categoryId: number
  title: string
}

const BookList = async ({ title, categoryId }: Props) => {
  const libraryItems = await getLibraryItemByCategory(categoryId, {
    pageSize: "5",
    pageIndex: 1,
    search: "",
  })

  if (!libraryItems || libraryItems.sources.length === 0) return null

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <Label className="text-2xl font-bold text-primary">
          {title} &nbsp;
          <span className="text-lg text-muted-foreground">
            ({libraryItems.sources.length} books)
          </span>
        </Label>
      </div>

      {/* Grid hiển thị danh sách sách */}
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
                <div className="flex items-center gap-1 truncate text-sm">
                  <User2 size={16} className="text-primary" /> by &nbsp;
                  {item.authors.map((a) => a.fullName).join(", ")}
                </div>
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
        ))}
      </div>
    </div>
  )
}

export default BookList
