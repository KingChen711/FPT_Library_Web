import { Link } from "@/i18n/routing"
import {
  BookOpen,
  CheckCircle2,
  CircleX,
  Headphones,
  MapPin,
  Plus,
  User2,
} from "lucide-react"

import { getTranslations } from "@/lib/get-translations"
import { type LibraryItem } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import LibraryItemStatusBadge from "@/components/badges/libraryItem-status-badge"

import BookBorrowDialog from "../book-borrow-dialog"

type Props = {
  libraryItem: LibraryItem
}

const BookInfoCard = async ({ libraryItem }: Props) => {
  const t = await getTranslations("BookPage")

  return (
    <div
      className={cn(
        "flex w-3/5 flex-col justify-between overflow-y-auto rounded-md border bg-card p-4 shadow-lg"
      )}
    >
      <div className="space-y-2">
        <p className="font-thin italic">
          {t("an edition of")} &nbsp;
          <span className="font-semibold">{libraryItem.title}</span>
        </p>

        <h1 className="line-clamp-2 text-2xl font-semibold text-primary">
          {libraryItem?.title}
        </h1>
        <p>{libraryItem.subTitle}</p>
        <div className="flex items-center justify-between gap-2">
          {libraryItem.authors.length > 0 ? (
            <div className="flex items-center gap-2 text-sm italic">
              <User2 size={16} /> by &nbsp;
              {libraryItem.authors[0].fullName || ""}
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <Badge variant={"draft"} className="w-fit">
          No.{libraryItem.editionNumber} Edition
        </Badge>
        <div className="my-2 flex justify-between text-sm">
          <div>
            ⭐ {libraryItem.avgReviewedRate} / 5 {t("fields.ratings")}
          </div>
        </div>
        <div className="my-2 flex justify-between text-sm">
          {/* Availability */}
          <div>
            <h1 className="font-semibold">
              {t("fields.availability")} (
              {libraryItem.libraryItemInventory.availableUnits} /&nbsp;
              {libraryItem.libraryItemInventory.totalUnits})
            </h1>
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
              {libraryItem.status && (
                <LibraryItemStatusBadge status={libraryItem.status} />
              )}
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
      <div className="mt-4 flex items-center gap-4">
        <BookBorrowDialog />
        <Button asChild variant={"outline"}>
          <Link href={`/books/${libraryItem.libraryItemId}/ebook?audio=true`}>
            <Headphones /> {t("audio")}
          </Link>
        </Button>
        <Button asChild variant={"outline"}>
          <Link href={`/books/${libraryItem.libraryItemId}/ebook?audio=false`}>
            <BookOpen /> {t("read now")}
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default BookInfoCard
