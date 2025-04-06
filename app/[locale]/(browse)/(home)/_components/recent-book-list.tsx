"use client"

import { useLibraryStorage } from "@/contexts/library-provider"
import { useTranslations } from "next-intl"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Label } from "@/components/ui/label"

import BookItemCard from "./book-item-card"

const RecentBookList = () => {
  const t = useTranslations("HomePage")
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
      <div className="mt-4 w-full">
        <Carousel opts={{ loop: false, slidesToScroll: 2 }} className="w-full">
          <CarouselContent className="space-x-2">
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

          <CarouselPrevious className="ml-3" />
          <CarouselNext className="mr-3" />
        </Carousel>
      </div>
    </div>
  )
}

export default RecentBookList
