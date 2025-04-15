"use client"

import { useFavourite } from "@/contexts/favourite-provider"
import { Heart, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import OverviewFavoriteItem from "@/components/ui/overview-favorite-item"
import {
  Sheet,
  SheetContent,
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
  const t = useTranslations("BookPage")

  const { favouriteItems, favouriteItemIds } = useFavourite()

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
                  {favouriteItemIds.length > 0 && (
                    <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-danger text-xs font-bold text-primary-foreground shadow-md">
                      {favouriteItemIds.length || null}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("Favorite list")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </SheetTrigger>

      <SheetContent className="flex flex-col gap-4 p-4">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">
            {t("Favorite Library Items")}
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {favouriteItems.length > 0 &&
            favouriteItems.map((item) => (
              <OverviewFavoriteItem key={item.libraryItemId} item={item} />
            ))}
        </div>

        {favouriteItems.length > 0 && (
          <div className="flex justify-end">
            <Button variant="destructive" className="px-4" onClick={() => {}}>
              <Trash2 />
              {t("remove all")}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default OverviewFavoriteList
