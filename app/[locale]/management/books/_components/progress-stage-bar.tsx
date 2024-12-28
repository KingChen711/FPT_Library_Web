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
  setCurrentTab: (val: "General" | "Resources" | "Editions") => void
}

const tabs: Tab[] = [
  { id: 1, title: "General" },
  { id: 2, title: "Resources" },
  { id: 3, title: "Editions" },
] as const

export function ProgressTabBar({
  currentTab,
  //   setCurrentTab,
}: ProgressTabBarProps) {
  const t = useTranslations("BooksManagementPage")
  const currentTabId = tabs.find((i) => i.title === currentTab)!.id
  const progress = ((currentTabId - 1) / (tabs.length - 1)) * 100

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Progress value={progress} className="mb-4 h-2" />
      <div className="flex justify-between">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "relative flex flex-col items-center space-y-2",
              "transition-all duration-300 ease-in-out",
              tab.id <= currentTabId ? "text-primary" : "text-muted-foreground"
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
        ))}
      </div>
    </div>
  )
}
