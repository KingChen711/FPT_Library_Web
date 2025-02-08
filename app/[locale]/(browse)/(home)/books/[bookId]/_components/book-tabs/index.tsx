import React from "react"
import getLibraryItem from "@/queries/library-item/get-libraryItem"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import BookEditionTab from "./book-edition-tab"
import BookInstancesTab from "./book-instances-tab"
import BookOverviewTab from "./book-overview-tab"
import BookRelatedItemsTab from "./book-related-items-tab"
import BookReviewsTab from "./book-reviews-tab"

type Props = {
  libraryItemId: string
}

const BookTabs = async ({ libraryItemId }: Props) => {
  const libraryItem = await getLibraryItem(libraryItemId)

  if (!libraryItem) {
    return <div>Not found</div>
  }

  return (
    <Tabs
      defaultValue="overview"
      className="w-full rounded-lg border bg-primary-foreground p-4 shadow-lg"
    >
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger className="w-full" value="overview">
          Overview
        </TabsTrigger>
        <TabsTrigger className="w-full" value="view-edition">
          View Edition
        </TabsTrigger>
        <TabsTrigger className="w-full" value="instances">
          Instances
        </TabsTrigger>
        <TabsTrigger className="w-full" value="review">
          Reviews
        </TabsTrigger>
        <TabsTrigger className="w-full" value="related-items">
          Related Items
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <BookOverviewTab libraryItemId={libraryItemId} />
      </TabsContent>
      <TabsContent value="view-edition">
        <BookEditionTab libraryItemId={libraryItemId} />
      </TabsContent>
      <TabsContent value="instances">
        <BookInstancesTab
          libraryItemId={libraryItemId}
          libraryItem={libraryItem}
        />
      </TabsContent>
      <TabsContent value="review">
        <BookReviewsTab libraryItemId={libraryItemId} />
      </TabsContent>
      <TabsContent value="related-items">
        <BookRelatedItemsTab libraryItemId={libraryItemId} />
      </TabsContent>
    </Tabs>
  )
}

export default BookTabs
