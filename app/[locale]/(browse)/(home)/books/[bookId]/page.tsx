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
    bookId: string
  }
}

const BookDetailPage = async ({ params: { bookId } }: Props) => {
  const t = await getTranslations("BookPage")
  const tRoute = await getTranslations("Routes")
  const libraryItem = await getLibraryItem(bookId)

  if (!libraryItem) {
    return <div>{t("Library item not found")}</div>
  }

  // const notHavingAuthor = !(
  //   libraryItem.authors && libraryItem.authors.length > 0
  // )
  const notHavingAuthor = false

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

      {notHavingAuthor ? (
        <div className="flex h-full gap-4">
          <section className="h-full flex-1 space-y-4">
            <div className="flex h-[60vh] gap-4">
              <div
                className={cn(
                  "flex w-full justify-between overflow-y-auto rounded-lg border bg-card p-4 shadow-lg"
                )}
              >
                <BookPreviewCard libraryItem={libraryItem} />
                <LibraryItemInfo
                  id={libraryItem.libraryItemId.toString()}
                  showInstances={false}
                />
              </div>
            </div>
            <BookTabs libraryItemId={libraryItem.libraryItemId.toString()} />
          </section>
        </div>
      ) : (
        <div className="flex h-full gap-4">
          <BookPreviewCard libraryItem={libraryItem} />
          <section className="h-full flex-1 space-y-4">
            <div className="flex h-[60vh] gap-4">
              <div
                className={cn(
                  "flex w-3/5 flex-col justify-between overflow-y-auto rounded-lg border bg-card p-4 shadow-lg"
                )}
              >
                <LibraryItemInfo
                  id={libraryItem.libraryItemId.toString()}
                  showInstances={false}
                />
              </div>
              <BookAuthorCard libraryItem={libraryItem} />
            </div>
            <BookTabs libraryItemId={libraryItem.libraryItemId.toString()} />
          </section>
        </div>
      )}
    </div>
  )
}

export default BookDetailPage
