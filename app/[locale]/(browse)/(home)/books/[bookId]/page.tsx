import { ChevronRight } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { dummyBooks } from "../../_components/dummy-books"
import BookAuthorCard from "./_components/book-cards/author-card"
import BookInfoCard from "./_components/book-cards/book-info-card"
import BookPreviewCard from "./_components/book-cards/book-preview-card"
import BookTabs from "./_components/book-tabs"

type Props = {
  params: {
    bookId: string
  }
}

const BookDetailPage = ({ params: { bookId } }: Props) => {
  const book = dummyBooks.find((book) => book.id.toString() === bookId)

  if (!book) {
    return <div>Book not found</div>
  }

  return (
    <div className="size-full space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/books">Books</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>{book.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex h-full gap-4">
        <BookPreviewCard bookId={book.id.toString()} />
        <section className="h-full flex-1 space-y-4">
          <div className="flex h-[56vh] gap-4">
            <BookInfoCard bookId={book.id.toString()} />
            <BookAuthorCard bookId={book.id.toString()} />
          </div>
          <BookTabs />
        </section>
      </div>
    </div>
  )
}

export default BookDetailPage
