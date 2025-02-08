"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

interface Tab {
  id: number
  title: string
}

interface ProgressTabBarProps {
  currentTab: string
  setCurrentTab: React.Dispatch<React.SetStateAction<string>>
  hasTrainAI: boolean | undefined
}

const tabs: Tab[] = [
  { id: 1, title: "Category" },
  { id: 2, title: "Catalog" },
  { id: 3, title: "Individual registration" },
  { id: 4, title: "Resources" },
  { id: 5, title: "Train AI" },
] as const

export function ProgressTabBar({
  currentTab,
  setCurrentTab,
  hasTrainAI = true,
}: ProgressTabBarProps) {
  const t = useTranslations("BooksManagementPage")
  const currentTabId = tabs.find((i) => i.title === currentTab)!.id
  const progress =
    ((currentTabId - 1) / (tabs.length - 1 - (hasTrainAI ? 0 : 1))) * 100

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
      <Progress value={progress} className="mb-4 h-2 w-[calc(100%-74px)]" />
      <div className="flex w-full justify-between">
        {tabs.map((tab) => {
          if (!hasTrainAI && tab.id === 5) return null

          return (
            <div
              key={tab.id}
              onClick={() => {
                if (tab.id >= currentTabId || currentTabId === 5) return
                setCurrentTab(tab.title)
              }}
              className={cn(
                "relative flex flex-col items-center space-y-2",
                "transition-all duration-300 ease-in-out",
                tab.id <= currentTabId
                  ? "text-primary"
                  : "text-muted-foreground",
                tab.id < currentTabId && "cursor-pointer"
              )}
            >
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-sm font-medium",
                  "transition-all duration-300 ease-in-out",
                  tab.id < currentTabId
                    ? "bg-primary text-primary-foreground"
                    : tab.id === currentTabId
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/30"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {tab.id}
              </div>
              <span className="w-20 text-center text-xs font-bold">
                {t(tab.title)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
