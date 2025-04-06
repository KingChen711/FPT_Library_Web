"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import NoImage from "@/public/assets/images/no-image.png"

import { type TSearchLibraryItemSchema } from "@/lib/validations/library-items/search-library-items"
import useLibraryItemByCategory from "@/hooks/library-items/use-libraryItem-by-category"
import { Card } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

import BookItemCard from "./book-item-card"

type Props = {
  categoryId: number
  title: string
}

const VALID_PAGE_SIZES = ["5", "6", "10", "30", "50", "100"]

const BookList = ({ title, categoryId }: Props) => {
  const [pageSize, setPageSize] =
    useState<TSearchLibraryItemSchema["pageSize"]>("6")
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)

  const { data: libraryItems, isLoading } = useLibraryItemByCategory(
    categoryId,
    {
      pageSize: pageSize,
      pageIndex: 1,
      search: "",
    }
  )

  // Auto-increase pageSize when scroll reaches end
  useEffect(() => {
    if (!carouselApi) return

    const handleSelect = () => {
      const canScrollNext = carouselApi.canScrollNext()

      if (!canScrollNext) {
        setPageSize((prev) => {
          const nextVal = String(Number(prev) + 4)
          if (VALID_PAGE_SIZES.includes(nextVal)) {
            return nextVal as TSearchLibraryItemSchema["pageSize"]
          }
          return prev
        })
      }
    }

    handleSelect()
    carouselApi.on("select", handleSelect)

    return () => {
      carouselApi.off("select", handleSelect)
    }
  }, [carouselApi])

  if (isLoading) {
    return <BookListSkeleton />
  }

  if (!libraryItems || libraryItems?.sources?.length === 0) return null

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <Label className="text-2xl font-bold text-foreground">
          {title} &nbsp;
        </Label>
      </div>

      <div className="mt-4 w-full">
        <Carousel
          opts={{ loop: false, slidesToScroll: 2 }}
          className="w-full"
          setApi={setCarouselApi}
        >
          <CarouselContent className="space-x-2">
            {libraryItems.sources.map((item) => (
              <CarouselItem
                key={item.libraryItemId}
                className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 2xl:basis-1/6"
              >
                <BookItemCard libraryItem={item.libraryItemId} />
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

export default BookList

const BookListSkeleton = () => {
  return (
    <div className="mt-4 grid w-full gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {Array(6)
        .fill(null)
        .map((_, i) => (
          <Card
            key={i}
            className="group flex flex-col overflow-hidden rounded-md transition-all duration-200"
          >
            <Link href={`/books/${i}`}>
              <div className="relative flex aspect-[2.1/3] flex-1 items-center justify-center overflow-hidden rounded-t-md p-4">
                <div className="absolute inset-0 z-0 overflow-hidden rounded-md p-4">
                  <Skeleton className="size-full" />
                </div>
                <Image
                  src={NoImage.src}
                  alt=""
                  width={360}
                  height={480}
                  className="z-[5] size-full overflow-hidden rounded-md border object-fill"
                />
              </div>
              <div className="flex shrink-0 flex-col gap-1 p-3 pt-0">
                <Skeleton className="h-[20px] w-full" />
                <Skeleton className="h-[16px] w-full" />
              </div>
            </Link>
          </Card>
        ))}
    </div>
  )
}
