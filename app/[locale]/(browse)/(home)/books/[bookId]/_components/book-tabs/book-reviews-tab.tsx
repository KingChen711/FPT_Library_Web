import { auth } from "@/queries/auth"
import getCurrentUserReview from "@/queries/library-item/get-current-user-review"
import getReviewsLibraryItem from "@/queries/library-item/get-reviews-library-items"
import { format } from "date-fns"
import { User2 } from "lucide-react"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import { Card } from "@/components/ui/card"
import NoResult from "@/components/ui/no-result"
import Paginator from "@/components/ui/paginator"
import Rating from "@/components/ui/rating"

import RatingDialog from "./rating-dialog"

type Props = {
  libraryItemId: number
  averageRating: number
  searchParams: Record<string, string | string[]>
}

const BookReviewsTab = async ({
  libraryItemId,
  averageRating,
  searchParams,
}: Props) => {
  const t = await getTranslations("BookPage")
  const reviews = await getReviewsLibraryItem(Number(libraryItemId), {
    search: "",
    pageIndex: Number(searchParams?.["ratingPageIndex"]) || 1,
    pageSize: Number(searchParams?.["ratingPageSize"])
      ? (searchParams["pageSize"] as "5" | "10" | "30" | "50" | "100")
      : "5",
  })

  const currentUserReview = await getCurrentUserReview(libraryItemId)
  const formatLocale = await getFormatLocale()
  const userType = auth().userType

  return (
    <div className="space-y-4">
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold">
          <div className="text-xl font-normal">{t("Review")}:</div>
          <div className="flex items-end">
            <span className="text-2xl">{averageRating}</span>
            <span className="text-lg">/{5}</span>
          </div>
          <Rating size="lg" value={averageRating} />
          <span className="text-xl font-normal">
            ({reviews.totalActualItem})
          </span>
        </div>
        {userType === "user" && (
          <RatingDialog
            libraryItemId={libraryItemId}
            ratingValue={currentUserReview?.ratingValue || undefined}
            reviewText={currentUserReview?.reviewText || undefined}
          />
        )}
      </div>
      {reviews.sources.length === 0 && (
        <NoResult
          title={t("Reviews Not Found")}
          description={t(
            "There are currently no reviews for this document Be the first to review"
          )}
        />
      )}
      {reviews.sources.map((review) => (
        <Card
          key={review.reviewId}
          className="rounded-md p-4 shadow-md transition-all duration-200 hover:shadow-lg"
        >
          <div className="flex items-center gap-3 border-b pb-3">
            <div className="flex h-full items-center justify-between overflow-hidden rounded-full border-2 border-black p-2">
              <User2 size={24} />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold">
                {`${review.user.lastName} ${review.user.firstName}`}
              </p>
              <p className="text-sm text-muted-foreground">
                {review.createDate &&
                  format(new Date(review.createDate), "HH:mm dd MMM yyyy", {
                    locale: formatLocale,
                  })}
              </p>
            </div>
          </div>

          <div className="mt-3">
            <p className="flex items-center gap-2 text-lg font-semibold">
              ⭐{review.ratingValue} / 5
            </p>
            <p className="mt-2 text-muted-foreground">{review.reviewText}</p>
          </div>
        </Card>
      ))}
      {reviews.sources.length > 0 && (
        <Paginator
          pageIndexKey="ratingPageIndex"
          pageSizeKey="ratingPageSize"
          pageSize={5}
          pageIndex={1}
          totalActualItem={reviews.totalActualItem}
          totalPage={Math.floor(reviews.totalPage)}
          className="mt-6"
        />
      )}
    </div>
  )
}

export default BookReviewsTab
