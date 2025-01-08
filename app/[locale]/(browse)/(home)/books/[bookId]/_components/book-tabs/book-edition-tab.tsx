import React from "react"
import Image from "next/image"
import { Book, BookOpen, Earth, Headphones } from "lucide-react"

import { Button } from "@/components/ui/button"
import Paginator from "@/components/ui/paginator"

import { dummyBooks } from "../../../../_components/dummy-books"

const BookEditionTab = () => {
  return (
    <div className="flex flex-col gap-4">
      {dummyBooks.map((book) => (
        <div key={book.id} className="rounded-lg border p-4 shadow-lg">
          <div className="flex items-start gap-4">
            <Image
              src={book.image}
              alt="Logo"
              width={60}
              height={90}
              className="object-contain duration-150 ease-in-out hover:scale-105"
            />
            <div className="flex flex-1 justify-between">
              <div className="space-y-2">
                <h1 className="text-lg font-semibold text-primary">
                  {book.title}
                </h1>
                <p className="text-sm">{book.author}</p>
                <p className="flex gap-2 text-sm">
                  <Earth size={16} className="text-primary" /> English
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <Button>
                  <Book /> Borrow
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="destructive">
                    <Headphones />
                  </Button>
                  <Button variant="destructive">
                    <BookOpen />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <Paginator
        pageSize={5}
        pageIndex={1}
        totalActualItem={10}
        totalPage={2}
        className="mt-6"
      />
    </div>
  )
}

export default BookEditionTab
