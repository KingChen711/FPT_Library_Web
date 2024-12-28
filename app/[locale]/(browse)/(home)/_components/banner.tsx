"use client"

import React from "react"
import Autoplay from "embla-carousel-autoplay"

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
  return (
    <div className="grid h-[240px] w-full grid-cols-3 gap-4">
      <div className="col-span-1 h-full overflow-hidden rounded-lg bg-red-50">
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
          <CarouselPrevious className="absolute left-2 top-1/2 size-6 -translate-y-1/2 rounded-full" />
          <CarouselNext className="absolute right-2 top-1/2 size-6 -translate-y-1/2 rounded-full" />
        </Carousel>
      </div>

      <div className="col-span-2 flex h-full rounded-lg border-2 border-primary bg-primary-foreground shadow-lg">
        <div className="flex w-1/12 items-center justify-center bg-primary text-xl font-semibold text-accent">
          <p className="-rotate-90 text-nowrap">New Arrivals</p>
        </div>
        <div className="flex gap-8 overflow-x-auto p-4">List of books...</div>
      </div>
    </div>
  )
}

export default BannerHome
