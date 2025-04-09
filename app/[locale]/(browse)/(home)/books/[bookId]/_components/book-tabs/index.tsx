import React from "react"
import getLibraryItem from "@/queries/library-item/get-libraryItem"

import { getTranslations } from "@/lib/get-translations"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import BookEditionTab from "./book-edition-tab"
import BookInstancesTab from "./book-instances-tab"
import BookOverviewTab from "./book-overview-tab"
import BookRelatedItemsTab from "./book-related-items-tab"
import BookReviewsTab from "./book-reviews-tab"

type Props = {
  libraryItemId: number
}

const BookTabs = async ({ libraryItemId }: Props) => {
  const t = await getTranslations("BookPage")
  const libraryItem = await getLibraryItem(libraryItemId)

  if (!libraryItem) {
    return <div>{t("Book not found")}</div>
  }

  return (
    <Tabs
      defaultValue="overview"
      className="w-full rounded-md border bg-card p-4 shadow-lg"
    >
      <TabsList className="grid w-full grid-cols-5">
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
        <BookOverviewTab libraryItemId={libraryItemId} />
      </TabsContent>
      <TabsContent value="view-edition">
        <BookEditionTab libraryItemId={libraryItemId} />
      </TabsContent>
      <TabsContent value="instances">
        <BookInstancesTab libraryItem={libraryItem} />
      </TabsContent>
      <TabsContent value="review">
        <BookReviewsTab
          averageRating={libraryItem.avgReviewedRate || 0}
          libraryItemId={libraryItemId}
        />
      </TabsContent>
      <TabsContent value="related-items">
        <BookRelatedItemsTab libraryItemId={libraryItemId} />
      </TabsContent>
    </Tabs>
  )
}

export default BookTabs
