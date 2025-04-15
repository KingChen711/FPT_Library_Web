import Image from "next/image"
import Link from "next/link"
import getRelatedLibraryItems from "@/queries/library-item/get-related-library-items"
import { Earth } from "lucide-react"

import { getTranslations } from "@/lib/get-translations"
import { searchLibraryItemsSchema } from "@/lib/validations/library-items/search-library-items"
import { Button } from "@/components/ui/button"
import NoData from "@/components/ui/no-data"
import Paginator from "@/components/ui/paginator"

type Props = {
  libraryItemId: number
  searchParams: Record<string, string | string[] | undefined>
}

const BookRelatedItemsTab = async ({ libraryItemId, searchParams }: Props) => {
  const t = await getTranslations("BookPage")

  const { pageIndex, pageSize } = searchLibraryItemsSchema.parse(searchParams)

  const {
    sources: relatedItems,
    totalActualItem,
    totalPage,
  } = await getRelatedLibraryItems(libraryItemId, {
    search: "",
    pageIndex,
    pageSize,
  })

  if (relatedItems.length === 0) {
    return <NoData />
  }

  return (
    <div className="flex flex-col gap-4">
      {/* <div className="relative w-1/3">
        <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Search book"
          className="pl-8"
          autoComplete="off"
        />
      </div> */}
      {relatedItems?.map((item) => (
        <div
          key={item.libraryItemId}
          className="flex items-start gap-4 rounded-md border p-4 shadow-lg"
        >
          <div className="flex w-full items-start justify-between gap-4">
            <Image
              src={item.coverImage as string}
              alt="Logo"
              width={60}
              height={90}
              className="object-contain duration-150 ease-in-out hover:scale-105"
            />
            <div className="flex flex-1 items-center justify-between">
              <div className="space-y-2">
                <Link href={`/books/${item.libraryItemId}`}>
                  <h1 className="text-lg font-semibold text-primary">
                    {item.title}
                  </h1>
                </Link>
                {item.authors && (
                  <p className="text-sm">{item.authors[0]?.fullName}</p>
                )}
                <p className="flex items-center gap-2 text-sm capitalize">
                  <Earth size={16} className="text-primary" />
                  {item.language}
                </p>
              </div>
              <Button variant="link" asChild>
                <Link href={`/books/${item.libraryItemId}`}>{t("detail")}</Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
      <Paginator
        pageSize={+pageSize}
        pageIndex={pageIndex}
        totalActualItem={totalActualItem}
        totalPage={totalPage}
        className="mt-6"
      />
    </div>
  )
}

export default BookRelatedItemsTab
