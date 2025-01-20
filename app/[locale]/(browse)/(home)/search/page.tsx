import React from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdvancedSearchTab from "@/components/book-filter-tabs/advanced-search-tab"
import BasicSearchTab from "@/components/book-filter-tabs/basic-search-tab"
import QuickSearchTab from "@/components/book-filter-tabs/quick-search-tab"

const SearchPage = () => {
  return (
    <div>
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quick-search">Quick search</TabsTrigger>
          <TabsTrigger value="basic-search">Basic search</TabsTrigger>
          <TabsTrigger value="advanced-search">Advanced search</TabsTrigger>
        </TabsList>
        <TabsContent value="quick-search">
          <QuickSearchTab />
        </TabsContent>
        <TabsContent value="basic-search">
          <BasicSearchTab />
        </TabsContent>
        <TabsContent value="advanced-search">
          <AdvancedSearchTab />
        </TabsContent>
      </Tabs>

      <div>Search Result</div>
    </div>
  )
}

export default SearchPage
