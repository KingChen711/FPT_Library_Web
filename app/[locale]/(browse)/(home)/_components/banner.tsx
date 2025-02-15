"use client"

import Image from "next/image"
import { useRouter } from "@/i18n/routing"
import Autoplay from "embla-carousel-autoplay"
import { Loader2 } from "lucide-react"

import useNewArrivals from "@/hooks/library-items/use-new-arrivals"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const quotes = [
  {
    id: 1,
    quote: "The best way to predict the future is to create it.",
    author: "Peter Drucker",
  },
  {
    id: 2,
    quote:
      "Success is not the key to happiness. Happiness is the key to success.",
    author: "Albert Schweitzer",
  },
  {
    id: 3,
    quote:
      "Your time is limited, so don’t waste it living someone else’s life.",
    author: "Steve Jobs",
  },
  {
    id: 4,
    quote: "Life is what happens when you’re busy making other plans.",
    author: "John Lennon",
  },
  {
    id: 5,
    quote: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt",
  },
]
const BannerHome = () => {
  const router = useRouter()
  const { data: libraryItems, isLoading } = useNewArrivals()
  if (!libraryItems || isLoading || libraryItems.length === 0) {
    return <Loader2 className="animate-spin" />
  }

  return (
    <div className="grid h-[240px] w-full grid-cols-3 gap-4">
      <div className="col-span-1 h-full overflow-hidden rounded-lg">
        <Carousel
          opts={{
            loop: true,
            align: "center",
            duration: 150,
          }}
          plugins={[
            Autoplay({
              delay: 6000,
            }),
          ]}
        >
          <CarouselContent className="h-full space-x-4">
            {quotes.map(({ id, quote, author }) => (
              <CarouselItem key={id}>
                <Card>
                  <CardContent className="flex h-[240px] flex-col justify-between gap-6 overflow-hidden rounded-lg bg-gradient-to-br from-primary to-primary/70 p-8 shadow-lg">
                    <h1 className="mb-2 px-4 text-left text-2xl font-semibold text-accent">
                      Today&apos;s quote
                    </h1>
                    <div className="mb-2 px-4 text-center font-serif text-lg font-semibold text-accent">
                      {`"${quote}"`}
                    </div>
                    <div className="text-right text-sm font-medium italic text-accent">
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

      <div className="col-span-2 flex h-full rounded-lg border-8 border-primary shadow-lg">
        <div className="flex w-1/12 items-center justify-center bg-primary text-xl font-semibold text-accent">
          <p className="-rotate-90 text-nowrap">New Arrivals</p>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-2xl"
          >
            <CarouselContent className="flex h-full space-x-4">
              {libraryItems.map((item) => (
                <CarouselItem
                  key={item.libraryItemId}
                  className="h-full basis-1/4"
                >
                  <div
                    onClick={() => router.push(`/books/${item.libraryItemId}`)}
                    className="flex h-[180px] items-center justify-center overflow-hidden rounded-lg p-4 shadow-lg"
                  >
                    <Image
                      src={item.coverImage as string}
                      priority
                      alt="Logo"
                      width={240}
                      height={320}
                      className="object-cover duration-150 ease-in-out hover:scale-105"
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
