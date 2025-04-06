import getLibraryItem from "@/queries/library-item/get-libraryItem"
import { ChevronRight } from "lucide-react"

import { getTranslations } from "@/lib/get-translations"
import { cn } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import LibraryItemInfo from "@/components/ui/library-item-info"

import BookAuthorCard from "./_components/book-cards/author-card"
import BookPreviewCard from "./_components/book-cards/book-preview-card"
import BookTabs from "./_components/book-tabs"

type Props = {
  params: {
    bookId: number
  }
}

const BookDetailPage = async ({ params: { bookId } }: Props) => {
  const t = await getTranslations("BookPage")
  const tRoute = await getTranslations("Routes")
  const libraryItem = await getLibraryItem(bookId)

  if (!libraryItem) {
    return <div>{t("Library item not found")}</div>
  }

  return (
    <div className="size-full space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">{tRoute("Home")}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{libraryItem.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {libraryItem.authors && libraryItem.authors.length > 0 ? (
        <div className="flex h-full gap-4">
          <section className="h-full w-1/5 bg-card">
            <BookPreviewCard libraryItem={libraryItem} />
          </section>
          <section className="h-full flex-1 space-y-4">
            <div className="flex h-[60vh] gap-4">
              <div
                className={cn(
                  "flex w-3/5 flex-col justify-between overflow-y-auto rounded-md border bg-card p-4 shadow-lg"
                )}
              >
                <LibraryItemInfo
                  id={libraryItem.libraryItemId}
                  showInstances={false}
                />
              </div>
              <BookAuthorCard libraryItem={libraryItem} />
            </div>
            <BookTabs libraryItemId={libraryItem.libraryItemId} />
          </section>
        </div>
      ) : (
        <div className="container flex h-full justify-center gap-4">
          <section className="h-full w-3/4 space-y-4">
            <div className="flex h-[70vh] gap-4">
              <div
                className={cn(
                  "flex w-full justify-between gap-4 rounded-md border bg-card p-4 shadow-lg"
                )}
              >
                <section className="h-full w-1/3 bg-card">
                  <BookPreviewCard libraryItem={libraryItem} />
                </section>
                <div className="overflow-y-auto">
                  <LibraryItemInfo
                    id={libraryItem.libraryItemId}
                    showInstances={false}
                  />
                </div>
              </div>
            </div>
            <BookTabs libraryItemId={libraryItem.libraryItemId} />
          </section>
        </div>
      )}
    </div>
  )
}

export default BookDetailPage
