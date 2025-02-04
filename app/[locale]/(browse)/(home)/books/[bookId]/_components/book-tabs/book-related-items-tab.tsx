import Image from "next/image"
import { Link } from "@/i18n/routing"
import getRelatedLibraryItems from "@/queries/library-item/get-related-library-items"
import { Earth, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Paginator from "@/components/ui/paginator"

type Props = {
  libraryItemId: string
}

const BookRelatedItemsTab = async ({ libraryItemId }: Props) => {
  const relatedItems = await getRelatedLibraryItems(Number(libraryItemId), {
    search: "",
    pageIndex: 1,
    pageSize: "5",
  })

  if (relatedItems.sources.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-center text-lg font-semibold">
          No related items found
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-1/3">
        <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2" />
        <Input
          type="text"
          placeholder="Search book"
          className="pl-8"
          autoComplete="off"
        />
      </div>
      {relatedItems?.sources?.map((item) => (
        <div
          key={item.libraryItemId}
          className="rounded-lg border p-4 shadow-lg"
        >
          <div className="flex items-start gap-4">
            <Image
              src={item.coverImage as string}
              alt="Logo"
              width={60}
              height={90}
              className="object-contain duration-150 ease-in-out hover:scale-105"
            />
            <div className="flex flex-1 items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-lg font-semibold text-primary">
                  {item.title}
                </h1>
                {item.authors && (
                  <p className="text-sm">{item.authors[0]?.fullName}</p>
                )}
                <p className="flex items-center gap-2 text-sm capitalize">
                  <Earth size={16} className="text-primary" />
                  {item.language}
                </p>
              </div>
              <Button variant="link" asChild>
                <Link href={`/books/${item.libraryItemId}`}>Detail</Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
      <Paginator
        pageSize={5}
        pageIndex={1}
        totalActualItem={10}
        totalPage={2}
        className="mt-6"
      />
    </div>
  )
}

export default BookRelatedItemsTab
