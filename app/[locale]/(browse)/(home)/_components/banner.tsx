"use client"

import Image from "next/image"
import { useRouter } from "@/i18n/routing"
import Autoplay from "embla-carousel-autoplay"
import { useTranslations } from "next-intl"

import useNewArrivals from "@/hooks/library-items/use-new-arrivals"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"

const quotes = [
  {
    id: 1,
    quote:
      "Success is not the key to happiness. Happiness is the key to success.",
    author: "Albert Schweitzer",
  },
  {
    id: 2,
    quote:
      "Your time is limited, so don’t waste it living someone else’s life.",
    author: "Steve Jobs",
  },
  {
    id: 3,
    quote: "Life is what happens when you’re busy making other plans.",
    author: "John Lennon",
  },
  {
    id: 4,
    quote: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt",
  },
]
const BannerHome = () => {
  const t = useTranslations("HomePage")
  const router = useRouter()
  const { data: libraryItems, isLoading } = useNewArrivals()

  if (!libraryItems || isLoading || libraryItems.length === 0) {
    return (
      <div className="grid h-[240px] w-full grid-cols-3 gap-4">
        <div className="col-span-1 h-full overflow-hidden rounded-md">
          <Card className="size-full">
            <CardContent className="flex h-full flex-col justify-between gap-4 p-6">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-1/3 self-end" />
            </CardContent>
          </Card>
        </div>

        <div className="col-span-2 flex h-full rounded-md border-8 border-primary shadow-lg">
          <div className="flex w-20 items-center justify-center bg-primary">
            <Skeleton className="h-5 w-[100px] -rotate-90" />
          </div>
          <div className="flex flex-1 items-center justify-around px-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-[180px] w-[120px] rounded-md" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid w-full grid-cols-12 gap-4">
      <div className="col-span-12 h-[240px] overflow-hidden rounded-md xl:col-span-5 2xl:col-span-4">
        <Carousel
          opts={{
            loop: true,
            align: "center",
            duration: 20,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
        >
          <CarouselContent className="h-full space-x-4">
            {quotes.map(({ id, author }, index) => (
              <CarouselItem key={id}>
                <Card>
                  <CardContent className="flex flex-col justify-between gap-6 overflow-hidden rounded-md bg-gradient-to-br from-primary to-primary/70 p-8 shadow-lg">
                    <h1 className="mb-2 px-4 text-left text-2xl font-semibold text-primary-foreground dark:text-foreground">
                      {t("today quote")}
                    </h1>
                    <div className="mb-2 px-4 text-center text-lg font-semibold text-primary-foreground dark:text-foreground">
                      {`"${t(`quote ${index + 1}`)}"`}
                    </div>
                    <div className="text-right text-sm font-medium italic text-primary-foreground dark:text-foreground">
                      - {author} -
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 size-4 -translate-y-1/2 rounded-full" />
          <CarouselNext className="absolute right-2 top-1/2 size-4 -translate-y-1/2 rounded-full" />
        </Carousel>
      </div>

      <div className="col-span-12 flex h-[240px] overflow-x-hidden rounded-md bg-primary shadow-lg xl:col-span-7 2xl:col-span-8">
        <div className="flex w-20 shrink-0 items-center justify-center bg-primary text-xl font-semibold text-accent">
          <p className="-rotate-90 text-nowrap text-primary-foreground dark:text-foreground">
            {t("new arrivals")}
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center rounded-md border-8 border-primary bg-background">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="h-full space-x-4">
              {libraryItems.map((item) => (
                <CarouselItem
                  key={item.libraryItemId}
                  className="flex h-full justify-center sm:basis-1/3 xl:basis-1/4 2xl:basis-1/5"
                >
                  <div
                    onClick={() => router.push(`/books/${item.libraryItemId}`)}
                    className="cursor-pointer overflow-hidden"
                  >
                    <Image
                      src={item.coverImage as string}
                      alt={item.title}
                      height={360}
                      width={240}
                      className="aspect-[2/3] h-[180px] w-[120px] rounded-md object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 top-1/2 size-4 -translate-y-1/2 rounded-full" />
            <CarouselNext className="absolute right-2 top-1/2 size-4 -translate-y-1/2 rounded-full" />
          </Carousel>
        </div>
      </div>
    </div>
  )
}

export default BannerHome
