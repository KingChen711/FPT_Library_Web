import React from "react"
import Image from "next/image"
import { MapPin, NotebookPen, Share } from "lucide-react"

import { Button } from "@/components/ui/button"

import { dummyBooks } from "../../../../_components/dummy-books"

type Props = {
  bookId: string
}

const BookPreviewCard = ({ bookId }: Props) => {
  const book = dummyBooks.find((book) => book.id.toString() === bookId)

  if (!book) {
    return <div>Book not found</div>
  }
  return (
    <section className="h-full w-1/4">
      <div className="flex h-[56vh] flex-col justify-between overflow-hidden rounded-lg bg-primary-foreground shadow-lg">
        <div className="flex flex-1 shrink-0 items-center justify-center overflow-hidden rounded-t-lg p-4">
          <Image
            src={book?.image}
            alt="Logo"
            width={200}
            height={250}
            className="object-contain duration-150 ease-in-out hover:scale-105"
          />
        </div>
        <div className="flex flex-col border-t-2">
          <Button className="flex items-center rounded-none">
            <MapPin /> Locate
          </Button>
          <div className="flex items-center justify-between py-2">
            <div className="flex flex-1 cursor-pointer items-center justify-center gap-2 hover:text-primary">
              <NotebookPen size={16} /> Review
            </div>
            <div className="h-6 w-0.5 bg-primary" />
            <div className="flex flex-1 cursor-pointer items-center justify-center gap-2 hover:text-primary">
              <Share size={16} /> Share
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BookPreviewCard
