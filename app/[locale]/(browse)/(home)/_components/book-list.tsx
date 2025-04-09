"use client"

import { useEffect, useRef } from "react"
import { Loader2 } from "lucide-react"
import { useInView } from "react-intersection-observer"

import { cn } from "@/lib/utils"
import useInfiniteLibraryItemByCategory from "@/hooks/library-items/use-infinite-library-items-by-category"
import { Card } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Icons } from "@/components/ui/icons"
import { Label } from "@/components/ui/label"
import { useSidebar } from "@/components/ui/sidebar"

import BookItemCard from "./book-item-card"

type Props = {
  categoryId: number
  title: string
}

const BookList = ({ title, categoryId }: Props) => {
  const { state } = useSidebar()

  const { ref, inView } = useInView()
  const carouselRef = useRef(null)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteLibraryItemByCategory({ categoryId, pageSize: 6 })

  const libraryItems = data?.pages.flatMap((page) => page.items) ?? []

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  if (libraryItems.length === 0) return null

  return (
    <div>
      <div className="flex items-center justify-between">
        <Label className="text-2xl font-bold text-foreground">
          {title} &nbsp;
        </Label>
      </div>
      <div className="mt-4 flex items-center justify-center">
        <Carousel
          ref={carouselRef}
          opts={{
            loop: true,
            align: "center",
            slidesToScroll: 6,
          }}
          className={cn(
            "relative w-full",
            state === "expanded" ? "max-w-[80vw]" : "max-w-[90vw]"
          )}
        >
          <CarouselContent>
            {status === "pending" ? (
              <Loader2 className="mr-2 animate-spin" />
            ) : status === "error" ? (
              <div>
                <Icons.X /> Error
              </div>
            ) : (
              libraryItems.map((item, index) => (
                <CarouselItem
                  key={index}
                  className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6"
                >
                  <Card>
                    <BookItemCard libraryItem={item.libraryItemId} />
                  </Card>
                </CarouselItem>
              ))
            )}

            {libraryItems.length > 0 && hasNextPage && (
              <div ref={ref} className="size-1" />
            )}
          </CarouselContent>
          <CarouselPrevious className="ml-8 size-8" />
          <CarouselNext className="mr-8 size-8" />
        </Carousel>
      </div>
    </div>
  )
}

export default BookList
