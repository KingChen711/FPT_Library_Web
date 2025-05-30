import { getTranslations } from "@/lib/get-translations"
import { type LibraryItem } from "@/lib/types/models"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import BookEditionTab from "./book-edition-tab"
import BookInstancesTab from "./book-instances-tab"
import BookOverviewTab from "./book-overview-tab"
import BookRelatedItemsTab from "./book-related-items-tab"
import BookReviewsTab from "./book-reviews-tab"

type Props = {
  libraryItem: LibraryItem
  searchParams: Record<string, string | string[]>
}

const BookTabs = async ({ libraryItem, searchParams }: Props) => {
  const t = await getTranslations("BookPage")

  return (
    <Tabs
      defaultValue="overview"
      className="w-full rounded-md border bg-card p-4 shadow-lg"
    >
      <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
        <TabsTrigger className="w-full" value="overview">
          {t("overview")}
        </TabsTrigger>
        <TabsTrigger className="w-full" value="view-edition">
          {t("view edition")}
        </TabsTrigger>
        <TabsTrigger className="w-full" value="instances">
          {t("instances")}
        </TabsTrigger>
        <TabsTrigger className="w-full" value="review">
          {t("reviews")}
        </TabsTrigger>
        <TabsTrigger className="w-full" value="related-items">
          {t("related items")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <BookOverviewTab libraryItem={libraryItem} />
      </TabsContent>
      <TabsContent value="view-edition">
        <BookEditionTab libraryItemId={libraryItem.libraryItemId} />
      </TabsContent>
      <TabsContent value="instances">
        <BookInstancesTab libraryItem={libraryItem} />
      </TabsContent>
      <TabsContent value="review">
        <BookReviewsTab
          searchParams={searchParams}
          averageRating={libraryItem.avgReviewedRate || 0}
          libraryItemId={libraryItem.libraryItemId}
        />
      </TabsContent>
      <TabsContent value="related-items">
        <BookRelatedItemsTab
          libraryItemId={libraryItem.libraryItemId}
          searchParams={searchParams}
        />
      </TabsContent>
    </Tabs>
  )
}

export default BookTabs
