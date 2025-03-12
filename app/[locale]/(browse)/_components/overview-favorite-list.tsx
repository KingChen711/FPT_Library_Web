"use client"

import { useEffect, useState } from "react"
import { LocalStorageKeys } from "@/constants"
import { Heart } from "lucide-react"

import { localStorageHandler } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import OverviewFavoriteItem from "@/components/ui/overview-favorite-item"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const OverviewFavoriteList = () => {
  const [likedLibraryItem, setLikedLibraryItem] = useState<string[]>([])

  const updateFavorites = () => {
    setLikedLibraryItem(localStorageHandler.getItem(LocalStorageKeys.FAVORITE))
  }

  useEffect(() => {
    updateFavorites()
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === LocalStorageKeys.FAVORITE) {
        updateFavorites()
      }
    }
    const handleCustomEvent = () => updateFavorites()
    window.addEventListener("storage", handleStorageChange)
    window.addEventListener(LocalStorageKeys.FAVORITE, handleCustomEvent)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener(LocalStorageKeys.FAVORITE, handleCustomEvent)
    }
  }, [])

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="relative">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Heart
                    size={20}
                    className="transition-transform duration-200 hover:scale-110"
                  />
                  {likedLibraryItem?.length > 0 && (
                    <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-danger text-xs font-bold text-white shadow-md">
                      {likedLibraryItem.length}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Favorite list</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </SheetTrigger>

      <SheetContent className="flex flex-col gap-4 p-4">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">
            Your Favorite Library Items
          </SheetTitle>
          <SheetDescription>
            Manage your saved books easily. Click on the trash icon to remove
            items.
          </SheetDescription>
        </SheetHeader>

        {likedLibraryItem.length > 0 &&
          likedLibraryItem.map((libraryItemId) => (
            <OverviewFavoriteItem
              key={libraryItemId}
              libraryItemId={libraryItemId}
            />
          ))}

        {likedLibraryItem.length > 0 && (
          <div className="flex justify-end">
            <Button
              variant="destructive"
              className="px-4"
              onClick={() =>
                localStorageHandler.clear(LocalStorageKeys.FAVORITE)
              }
            >
              Remove All
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default OverviewFavoriteList
