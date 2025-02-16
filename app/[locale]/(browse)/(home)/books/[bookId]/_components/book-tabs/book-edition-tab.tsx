import Image from "next/image"
import { Link } from "@/i18n/routing"
import getDetailEditions from "@/queries/library-item/get-detail-editions"
import { Earth, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Paginator from "@/components/ui/paginator"

type Props = {
  libraryItemId: string
}

const BookEditionTab = async ({ libraryItemId }: Props) => {
  const detailEditions = await getDetailEditions(Number(libraryItemId), {
    search: "",
    pageIndex: 1,
    pageSize: "5",
  })

  if (detailEditions.sources.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-center text-lg font-semibold">No editions found</p>
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
      {detailEditions.sources.map((edition) => (
        <div
          key={edition.libraryItemId}
          className="rounded-lg border p-4 shadow-lg"
        >
          <div className="flex items-start gap-4">
            <Image
              src={edition.coverImage as string}
              alt="Logo"
              width={60}
              height={90}
              className="object-contain duration-150 ease-in-out hover:scale-105"
            />
            <div className="flex flex-1 items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-lg font-semibold text-primary">
                  {edition.title}
                </h1>
                <p className="text-sm">{edition.authors[0].fullName}</p>
                <div className="flex items-center gap-2 text-sm capitalize">
                  <Earth size={16} className="text-primary" />
                  {edition.language}
                </div>
              </div>
              <Button variant="link" asChild>
                <Link href={`/books/${edition.libraryItemId}`}>Detail</Link>
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

export default BookEditionTab
