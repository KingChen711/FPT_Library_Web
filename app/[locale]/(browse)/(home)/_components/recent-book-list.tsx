"use client"

import { useLibraryStorage } from "@/contexts/library-provider"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Label } from "@/components/ui/label"
import { useSidebar } from "@/components/ui/sidebar"

import BookItemCard from "./book-item-card"

const RecentBookList = () => {
  const t = useTranslations("HomePage")
  const { state } = useSidebar()
  const { recentlyOpened } = useLibraryStorage()

  if (recentlyOpened.items.length === 0) return null

  return (
    <div>
      {recentlyOpened.items && recentlyOpened.items.length > 0 && (
        <div className="flex items-center justify-between">
          <Label className="text-2xl font-bold text-foreground">
            {t("recent read")} &nbsp;
          </Label>
        </div>
      )}
      <div className="mt-4 flex items-center justify-center">
        <Carousel
          opts={{
            loop: true,
            align: "center",
            slidesToScroll: 6,
          }}
          className={cn(
            "w-full",
            state === "expanded" ? "max-w-[74vw]" : "max-w-[90vw]"
          )}
        >
          <CarouselContent className="-ml-1">
            {recentlyOpened.items.length > 0 &&
              recentlyOpened.items.map((id) => (
                <CarouselItem
                  key={id}
                  className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6"
                >
                  <BookItemCard libraryItem={id} />
                </CarouselItem>
              ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  )
}

export default RecentBookList
