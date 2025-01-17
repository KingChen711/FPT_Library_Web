import { Filter } from "lucide-react"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import AdvancedSearchTab from "./advanced-search-tab"
import BasicSearchTab from "./basic-search-tab"
import QuickSearchTab from "./quick-search-tab"

export function BookFilterTabs() {
  return (
    <Popover>
      <PopoverTrigger className="flex cursor-pointer items-center gap-2 px-8">
        <Filter size={16} /> Filter
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="mt-2 w-[650px] space-y-4 bg-primary-foreground p-4"
      >
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
      </PopoverContent>
    </Popover>
  )
}
