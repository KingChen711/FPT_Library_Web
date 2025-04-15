"use client"

import React from "react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

interface Tab {
  title: string
}

interface ProgressTabBarProps {
  currentTab: string
  setCurrentTab: React.Dispatch<React.SetStateAction<string>>
  isBookSeries: boolean
}

const oldTabs: Tab[] = [
  { title: "Category" },
  { title: "Catalog" },
  { title: "Groups" },
  { title: "Individual registration" },
  { title: "Resources" },
] as const

export function ProgressTabBar({
  currentTab,
  setCurrentTab,
  isBookSeries = false,
}: ProgressTabBarProps) {
  const filteredTabs = oldTabs.filter((t) =>
    isBookSeries ? true : t.title !== "Groups"
  )
  const t = useTranslations("BooksManagementPage")
  const currentIndex = filteredTabs.findIndex((t) => t.title === currentTab)
  const progress = (currentIndex / (filteredTabs.length - 1)) * 100

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
      <Progress value={progress} className="mb-4 h-2 w-[calc(100%-74px)]" />
      <div className="flex w-full justify-between">
        {filteredTabs.map((tab, index) => {
          return (
            <div
              key={tab.title}
              onClick={() => {
                if (index >= currentIndex) return
                setCurrentTab(tab.title)
              }}
              className={cn(
                "relative flex flex-col items-center space-y-2",
                "transition-all duration-300 ease-in-out",
                index <= currentIndex
                  ? "text-primary"
                  : "text-muted-foreground",
                index < currentIndex && "cursor-pointer"
              )}
            >
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-sm font-medium",
                  "transition-all duration-300 ease-in-out",
                  index < currentIndex
                    ? "bg-primary text-primary-foreground"
                    : index === currentIndex
                      ? "bg-primary text-primary-foreground ring-4 ring-primary/30"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {index + 1}
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
