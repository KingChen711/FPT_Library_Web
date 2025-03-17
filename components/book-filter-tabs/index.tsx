import { Filter } from "lucide-react"
import { useTranslations } from "next-intl"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import AdvancedSearchTab from "./advanced-search-tab"
import BasicSearchTab from "./basic-search-tab"
import QuickSearchTab from "./quick-search-tab"

enum ESearchTabs {
  QuickSearch = "quick-search",
  BasicSearch = "basic-search",
  AdvancedSearch = "advanced-search",
}

export function BookFilterTabs() {
  const t = useTranslations("GeneralManagement")
  return (
    <Popover>
      <PopoverTrigger className="flex cursor-pointer items-center gap-2 px-8">
        <Filter size={16} /> {t("filters")}
      </PopoverTrigger>
      <PopoverContent align="start" className="mt-2 w-[650px] space-y-4 p-4">
        <Tabs defaultValue={ESearchTabs.QuickSearch} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value={ESearchTabs.QuickSearch}>
              {t("quick search")}
            </TabsTrigger>
            <TabsTrigger value={ESearchTabs.BasicSearch}>
              {t("basic search")}
            </TabsTrigger>
            <TabsTrigger value={ESearchTabs.AdvancedSearch}>
              {t("advanced search")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value={ESearchTabs.QuickSearch}>
            <QuickSearchTab />
          </TabsContent>
          <TabsContent value={ESearchTabs.BasicSearch}>
            <BasicSearchTab />
          </TabsContent>
          <TabsContent value={ESearchTabs.AdvancedSearch}>
            <AdvancedSearchTab />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
