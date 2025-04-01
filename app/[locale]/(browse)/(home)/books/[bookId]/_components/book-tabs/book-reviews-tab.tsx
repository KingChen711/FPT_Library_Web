import getReviewsLibraryItem from "@/queries/library-item/get-reviews-library-items"
import { User2 } from "lucide-react"

import { Card } from "@/components/ui/card"

type Props = {
  libraryItemId: string
}

const BookReviewsTab = async ({ libraryItemId }: Props) => {
  const reviews = await getReviewsLibraryItem(Number(libraryItemId), {
    search: "",
    pageIndex: 1,
    pageSize: "5",
  })

  if (reviews.sources.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-center text-lg font-semibold text-muted-foreground">
          No reviews found
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.sources.map((review) => (
        <Card
          key={review.reviewId}
          className="rounded-md p-4 shadow-md transition-all duration-200 hover:shadow-lg"
        >
          <div className="flex items-center gap-3 border-b pb-3">
            {/* <Avatar>
              <AvatarImage src={"https://github.com/shadcn.png"} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar> */}
            <div className="flex h-full items-center justify-between overflow-hidden rounded-full border-2 border-black p-2">
              <User2 size={24} />
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-semibold">
                {`${review.user.lastName} ${review.user.firstName}`}
              </p>
              <p className="text-sm text-muted-foreground">
                {review.createDate &&
                  new Date(review.createDate).toDateString()}
              </p>
            </div>
          </div>

          <div className="mt-3">
            <p className="flex items-center gap-2 text-lg font-semibold">
              ⭐{review.ratingValue} / 5
            </p>
            <p className="mt-2 text-muted-foreground">
              {review.reviewText} Lorem ipsum dolor sit amet consectetur,
              adipisicing elit. Asperiores, nisi?
            </p>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default BookReviewsTab
