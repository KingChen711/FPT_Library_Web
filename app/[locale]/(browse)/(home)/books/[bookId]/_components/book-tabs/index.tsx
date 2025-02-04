import React from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import BookEditionTab from "./book-edition-tab"
import BookInstancesTab from "./book-instances-tab"
import BookOverviewTab from "./book-overview-tab"
import BookRelatedItemsTab from "./book-related-items-tab"

const BookTabs = () => {
  return (
    <Tabs defaultValue="overview" className="w-full rounded-lg p-4 shadow-lg">
      <TabsList className="flex justify-between">
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
          Review
        </TabsTrigger>
        <TabsTrigger className="w-full" value="related-items">
          Related Items
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <BookOverviewTab />
      </TabsContent>
      <TabsContent value="view-edition">
        <BookEditionTab />
      </TabsContent>
      <TabsContent value="instances">
        <BookInstancesTab />
      </TabsContent>
      <TabsContent value="review">Review content</TabsContent>
      <TabsContent value="related-items">
        <BookRelatedItemsTab />
      </TabsContent>
    </Tabs>
  )
}

export default BookTabs
