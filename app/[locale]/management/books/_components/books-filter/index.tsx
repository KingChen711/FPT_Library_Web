"use client"

import { Filter } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import AdvancedSearchTab from "./advanced-search-tab"

type Props = {
  f: string[]
  o: string[]
  v: string[]
}

export function BooksFilter({ f, o, v }: Props) {
  const t = useTranslations("BooksManagementPage")

  return (
    <Popover>
      <PopoverTrigger
        className="flex cursor-pointer items-center gap-2 px-8"
        asChild
      >
        <Button variant="outline" className="h-10 rounded-l-none border-input">
          <Filter size={16} />
          {t("Filter")}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="mt-2 w-[650px] space-y-4 p-4">
        {/* <Tabs defaultValue="quick-search" className="w-full">
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
          <TabsContent value="advanced-search"> */}
        <AdvancedSearchTab f={f} o={o} v={v} />
        {/* </TabsContent>
        </Tabs> */}
      </PopoverContent>
    </Popover>
  )
}
