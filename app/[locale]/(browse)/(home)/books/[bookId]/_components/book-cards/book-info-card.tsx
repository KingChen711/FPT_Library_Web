import { Link } from "@/i18n/routing"
import {
  BookOpen,
  CheckCircle2,
  CircleX,
  Headphones,
  MapPin,
  Plus,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { dummyBooks } from "../../../../_components/dummy-books"
import BookBorrowDialog from "../book-borrow-dialog"

type Props = {
  bookId: string
}

const BookInfoCard = ({ bookId }: Props) => {
  const book = dummyBooks.find((book) => book.id.toString() === bookId)

  if (!book) {
    return <div>Book not found</div>
  }
  return (
    <div className="flex w-3/5 flex-col justify-between rounded-lg bg-primary-foreground p-4 shadow-lg">
      <div className="space-y-2">
        <p className="font-thin italic">An edition of {book.title} (2024)</p>
        <h1 className="line-clamp-1 text-3xl font-semibold text-primary">
          {book?.title}
        </h1>
        <p className="text-lg">Lorem ipsum dolor sit amet adipisicing elit.</p>
        <p className="text-sm italic">by {book?.author}, 2000</p>
        <Badge variant={"secondary"} className="w-fit">
          Second Edition
        </Badge>
        <div className="flex justify-between text-sm">
          <div>⭐⭐⭐⭐⭐ 5/5 Ratings</div>
          <div>
            <span className="font-semibold">25</span> Reading
          </div>
          <div>
            <span className="font-semibold">119</span> Have read
          </div>
        </div>
        <div className="flex justify-between text-sm">
          {/* Availability */}
          <div>
            <h1 className="font-semibold">Availability</h1>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} color="white" fill="#42bb4e" />
                Hard copy
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} color="white" fill="#42bb4e" />
                E-book
              </div>
              <div className="flex items-center gap-2">
                <CircleX size={16} color="white" fill="#868d87" /> Audio book
              </div>
            </div>
          </div>
          {/* Status */}
          <div>
            <h1 className="font-semibold">Status</h1>
            <div className="mt-2 space-y-2">
              <Badge className="h-full w-fit bg-success hover:bg-success">
                Available
              </Badge>
              <div className="flex items-center">
                <MapPin color="white" fill="orange" /> CS A-15
              </div>
            </div>
          </div>
          <Button>
            <Plus /> Add to favorite
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <BookBorrowDialog />
        <Button asChild variant={"outline"}>
          <Link href={`/books/${bookId}/ebook?audio=true`}>
            <Headphones /> Audio
          </Link>
        </Button>
        <Button asChild variant={"outline"}>
          <Link href={`/books/${bookId}/ebook?audio=false`}>
            <BookOpen /> Read now
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default BookInfoCard
