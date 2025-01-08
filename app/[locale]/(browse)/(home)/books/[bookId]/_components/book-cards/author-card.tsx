import Image from "next/image"
import { Cake, User } from "lucide-react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { StyledReadMore } from "@/components/ui/read-more"

import { dummyBooks } from "../../../../_components/dummy-books"

type Props = {
  bookId: string
}

const BookAuthorCard = ({ bookId }: Props) => {
  const book = dummyBooks.find((book) => book.id.toString() === bookId)
  if (!book) {
    return <div>Book not found</div>
  }
  return (
    <section className="flex h-full flex-1 flex-col justify-between overflow-y-auto rounded-lg bg-primary-foreground p-4 shadow-lg">
      <div>
        <h1 className="text-xl font-semibold capitalize">
          <span className="text-primary">About</span> Author
        </h1>
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="flex items-center gap-2">
              <User size={18} /> {book?.author}
            </h1>
            <div className="flex items-center gap-2 text-sm">
              <Cake size={18} /> July 31, 1965
            </div>
          </div>
          <Image
            alt="Author"
            src="https://files.bestbooks.to/625e6d9b-dd99-4f83-8ce0-d361bcde9642.jpg"
            width={100}
            height={120}
            className="rounded-lg object-cover"
          />
        </div>
        <StyledReadMore truncate={80}>
          The author is renowned for captivating storytelling and has a profound
          impact on contemporary literature with numerous acclaimed works. The
          author writing style is characterized by vivid imagery, well-developed
          characters, and a deep emotional resonance. The author works often
          explore themes of social justice, personal identity, and the human
          condition, and are widely regarded as some of the most important and
          influential of the past century.
        </StyledReadMore>
      </div>
      <div className="mt-auto">
        <h1 className="mt-4 text-xl font-semibold">Other Books</h1>

        <div className="flex flex-1 items-center justify-center">
          <Carousel
            opts={{
              align: "start",
            }}
            className="w-full max-w-xl"
          >
            <CarouselContent className="flex h-full">
              {dummyBooks.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="h-full shrink-0 basis-1/4"
                >
                  <div className="flex h-[80] items-center justify-center overflow-hidden rounded-lg shadow-lg">
                    <Image
                      src={item.image}
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
    </section>
  )
}

export default BookAuthorCard
