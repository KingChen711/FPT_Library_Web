"use client"

import { useState } from "react"
import { Filter } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import AdvancedSearchTab from "./advanced-search-tab"
import BasicSearchTab from "./basic-search-tab"
import QuickSearchTab from "./quick-search-tab"

type Props = {
  f: string[]
  o: string[]
  v: string[]
  isTrained: boolean | undefined
}

export function BooksFilter({ f, o, v, isTrained: isTrainedInitial }: Props) {
  const t = useTranslations("BooksManagementPage")
  const [open, setOpen] = useState(false)
  const [isTrained, setIsTrained] = useState(isTrainedInitial)

  return (
    <Popover onOpenChange={setOpen} open={open}>
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
        <div className="space-y-3">
          <Label>Train AI</Label>
          <RadioGroup
            defaultValue={
              isTrained === undefined
                ? "all"
                : isTrained
                  ? "trained"
                  : "untrained"
            }
            onValueChange={(value) => {
              setIsTrained(
                value === "all" ? undefined : value === "trained" ? true : false
              )
            }}
            className="flex flex-row gap-4"
          >
            <div className="flex items-center space-x-3 space-y-0">
              <RadioGroupItem value="all" />
              <Label className="font-normal">{t("All")}</Label>
            </div>
            <div className="flex items-center space-x-3 space-y-0">
              <RadioGroupItem value="trained" />
              <Label className="font-normal">{t("Trained")}</Label>
            </div>
            <div className="flex items-center space-x-3 space-y-0">
              <RadioGroupItem value="untrained" />
              <Label className="font-normal">{t("Untrained")}</Label>
            </div>
          </RadioGroup>
        </div>

        <Tabs defaultValue="quick-search" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quick-search">{t("Quick search")}</TabsTrigger>
            <TabsTrigger value="basic-search">{t("Basic search")}</TabsTrigger>
            <TabsTrigger value="advanced-search">
              {t("Advanced search")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="quick-search">
            <QuickSearchTab isTrained={isTrained} />
          </TabsContent>
          <TabsContent value="basic-search">
            <BasicSearchTab isTrained={isTrained} />
          </TabsContent>
          <TabsContent value="advanced-search">
            <AdvancedSearchTab
              setOpen={setOpen}
              isTrained={isTrained}
              f={f}
              o={o}
              v={v}
            />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
