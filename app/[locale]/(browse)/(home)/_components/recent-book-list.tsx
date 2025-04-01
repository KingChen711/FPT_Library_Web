"use client"

import { useEffect, useState } from "react"
import { LocalStorageKeys } from "@/constants"
import { useTranslations } from "next-intl"

import { localStorageHandler } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import RecentBookItem from "@/components/ui/recent-book-item"

const RecentBookList = () => {
  const t = useTranslations("HomePage")
  const [recentIdList, setRecentIdList] = useState<string[]>([])
  const updateBorrows = () => {
    setRecentIdList(
      localStorageHandler.getItem(LocalStorageKeys.OPENING_RECENT)
    )
  }

  useEffect(() => {
    updateBorrows()
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === LocalStorageKeys.OPENING_RECENT) {
        updateBorrows()
      }
    }
    const handleCustomEvent = () => updateBorrows()
    window.addEventListener("storage", handleStorageChange)
    window.addEventListener(LocalStorageKeys.OPENING_RECENT, handleCustomEvent)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener(
        LocalStorageKeys.OPENING_RECENT,
        handleCustomEvent
      )
    }
  }, [])

  if (recentIdList.length === 0) return null

  return (
    <div>
      {recentIdList && recentIdList.length > 0 && (
        <div className="flex items-center justify-between">
          <Label className="text-2xl font-bold text-foreground">
            {t("recent read")} &nbsp;
            <span className="text-lg text-muted-foreground">
              ({recentIdList.length} {t("books")})
            </span>
          </Label>
        </div>
      )}
      <div className="mt-4 grid w-full gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {recentIdList &&
          recentIdList.length > 0 &&
          recentIdList.map((id) => (
            <RecentBookItem key={id} libraryItem={id} />
          ))}
      </div>
    </div>
  )
}

export default RecentBookList
