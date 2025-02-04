import { Link } from "@/i18n/routing"
import {
  BookOpen,
  CheckCircle2,
  CircleX,
  Headphones,
  MapPin,
  Plus,
} from "lucide-react"

import { getTranslations } from "@/lib/get-translations"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { dummyBooks } from "../../../../_components/dummy-books"
import BookBorrowDialog from "../book-borrow-dialog"

type Props = {
  bookId: string
}

const BookInfoCard = async ({ bookId }: Props) => {
  const t = await getTranslations("BookPage")

  const book = dummyBooks.find((book) => book.id.toString() === bookId)

  if (!book) {
    return <div>{t("Book not found")}</div>
  }

  return (
    <div className="flex w-3/5 flex-col justify-between rounded-lg p-4 shadow-lg">
      <div className="space-y-2">
        <p className="font-thin italic">
          {t("an edition of")} &nbsp;
          <span className="font-semibold">{book.title}</span> (2024)
        </p>
        <h1 className="line-clamp-1 text-3xl font-semibold text-primary">
          {book?.title}
        </h1>
        <p className="text-lg">Lorem ipsum dolor sit amet adipisicing elit.</p>
        <p className="text-sm italic">by {book?.author}, 2000</p>
        <Badge variant={"secondary"} className="w-fit">
          Second Edition
        </Badge>
        <div className="flex justify-between text-sm">
          <div>⭐⭐⭐⭐⭐ 5/5 {t("fields.ratings")}</div>
          <div>
            <span className="font-semibold">25</span> {t("fields.reading")}
          </div>
          <div>
            <span className="font-semibold">119</span> {t("fields.have read")}
          </div>
        </div>
        <div className="flex justify-between text-sm">
          {/* Availability */}
          <div>
            <h1 className="font-semibold">{t("fields.availability")}</h1>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} color="white" fill="#42bb4e" />
                {t("fields.hard copy")}
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} color="white" fill="#42bb4e" />
                {t("fields.ebook")}
              </div>
              <div className="flex items-center gap-2">
                <CircleX size={16} color="white" fill="#868d87" />
                {t("fields.audio book")}
              </div>
            </div>
          </div>
          {/* Status */}
          <div>
            <h1 className="font-semibold"> {t("fields.status")}</h1>
            <div className="mt-2 space-y-2">
              <Badge className="h-full w-fit bg-success hover:bg-success">
                {t("fields.availability")}
              </Badge>
              <div className="flex items-center">
                <MapPin color="white" fill="orange" /> CS A-15
              </div>
            </div>
          </div>
          <Button>
            <Plus /> {t("add to favorite")}
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <BookBorrowDialog />
        <Button asChild variant={"outline"}>
          <Link href={`/books/${bookId}/ebook?audio=true`}>
            <Headphones /> {t("audio")}
          </Link>
        </Button>
        <Button asChild variant={"outline"}>
          <Link href={`/books/${bookId}/ebook?audio=false`}>
            <BookOpen /> {t("read now")}
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default BookInfoCard
