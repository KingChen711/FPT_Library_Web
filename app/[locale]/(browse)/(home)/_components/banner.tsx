"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { useRouter } from "@/i18n/routing"
import Autoplay from "embla-carousel-autoplay"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useInView } from "react-intersection-observer"

import { cn } from "@/lib/utils"
import useInfiniteNewArrivals from "@/hooks/library-items/use-infinite-new-arrivals"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Icons } from "@/components/ui/icons"
import { useSidebar } from "@/components/ui/sidebar"

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
      "Your time is limited, so don't waste it living someone else's life.",
    author: "Steve Jobs",
  },
  {
    id: 3,
    quote: "Life is what happens when you're busy making other plans.",
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
  const { ref, inView } = useInView()
  const carouselRef = useRef(null)
  const { state: statusSidebar } = useSidebar()
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteNewArrivals({ pageSize: 30 })

  const newArrivals = data?.pages.flatMap((page) => page.items) ?? []

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

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
              delay: 6000,
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

        <div className="flex flex-1 items-center justify-center rounded-md border-8 border-primary bg-background px-8">
          <Carousel
            ref={carouselRef}
            opts={{
              loop: true,
              align: "center",
              slidesToScroll: 6,
            }}
            className={cn(
              statusSidebar === "expanded" ? "max-w-[40vw]" : "max-w-[50vw]"
            )}
          >
            <CarouselContent className="px-8">
              {status === "pending" ? (
                <Loader2 className="mr-2 animate-spin" />
              ) : status === "error" ? (
                <div>
                  <Icons.X /> Error
                </div>
              ) : (
                newArrivals.map((item) => (
                  <CarouselItem
                    key={item.libraryItemId}
                    className="flex h-full basis-1/6 justify-center gap-4 md:basis-1/4"
                  >
                    <div
                      onClick={() =>
                        router.push(`/books/${item.libraryItemId}`)
                      }
                      className="cursor-pointer"
                    >
                      <Image
                        src={(item.coverImage as string) || "/placeholder.svg"}
                        alt={item.title}
                        height={360}
                        width={240}
                        className="aspect-[2/3] h-[180px] w-[120px] rounded-md object-fill"
                      />
                    </div>
                  </CarouselItem>
                ))
              )}

              {newArrivals.length > 0 && hasNextPage && (
                <div ref={ref} className="size-1" />
              )}
            </CarouselContent>
            <CarouselPrevious className="ml-3 size-6" />
            <CarouselNext className="mr-3 size-6" />
          </Carousel>
        </div>
      </div>
    </div>
  )
}

export default BannerHome
