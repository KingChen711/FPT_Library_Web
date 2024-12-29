import React from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const BookTabs = () => {
  return (
    <Tabs
      defaultValue="account"
      className="h-[500px] w-full rounded-lg bg-primary-foreground p-4 shadow-lg"
    >
      <TabsList className="flex justify-between">
        <TabsTrigger className="w-full" value="overview">
          Overview
        </TabsTrigger>
        <TabsTrigger className="w-full" value="view-edition">
          View Edition
        </TabsTrigger>
        <TabsTrigger className="w-full" value="detail">
          Detail
        </TabsTrigger>
        <TabsTrigger className="w-full" value="review">
          Review
        </TabsTrigger>
        <TabsTrigger className="w-full" value="list">
          List
        </TabsTrigger>
        <TabsTrigger className="w-full" value="related-book">
          Related Book
        </TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview content</TabsContent>
      <TabsContent value="view-edition">View edition content</TabsContent>
      <TabsContent value="detail">Detail content</TabsContent>
      <TabsContent value="review">Review content</TabsContent>
      <TabsContent value="list">List content</TabsContent>
      <TabsContent value="related-book">Related book content</TabsContent>
    </Tabs>
  )
}

export default BookTabs
