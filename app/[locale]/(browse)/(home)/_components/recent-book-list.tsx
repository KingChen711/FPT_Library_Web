"use client"

import { useEffect, useState } from "react"
import { LocalStorageKeys } from "@/constants"

import { localStorageHandler } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import RecentBookItem from "@/components/ui/recent-book-item"

const RecentBookList = () => {
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

  return (
    <div>
      {recentIdList && recentIdList.length > 0 && (
        <div className="flex items-center justify-between">
          <Label className="text-2xl font-bold text-primary">
            Recent Book &nbsp;
            <span className="text-lg text-muted-foreground">
              ({recentIdList.length} books)
            </span>
          </Label>
        </div>
      )}
      <div className="mt-6 grid w-full gap-6 md:grid-cols-3 lg:grid-cols-5">
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
