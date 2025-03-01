import Image from "next/image"
import { Heart, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { dummyBooks } from "../(home)/_components/dummy-books"

const OverviewFavoriteList = () => {
  const favoriteItems = [1, 2, 3, 4, 5, 6, 7, 8, 9] // Thay thế bằng dữ liệu thực tế

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Heart
            size={18}
            className="text-red-500 transition-transform duration-200 hover:scale-110"
          />
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col gap-4 p-4">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">
            Your Favorite Library Items
          </SheetTitle>
          <SheetDescription>
            Manage your saved books easily. Click on the trash icon to remove
            items.
          </SheetDescription>
        </SheetHeader>

        {dummyBooks.length > 0 ? (
          <div className="flex-1 space-y-3 overflow-y-auto">
            {dummyBooks.map((book) => (
              <Card
                key={book.id}
                className="flex items-start gap-4 rounded-lg p-3 shadow transition hover:bg-gray-100"
              >
                <Image
                  src={book.image}
                  alt="Book cover"
                  width={60}
                  height={60}
                  className="rounded-md"
                />
                <div className="flex-1">
                  <p className="font-medium">{book.title}</p>
                  <p className="text-sm text-gray-600">{book.author}</p>
                  <p className="text-sm text-gray-500">Publisher</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-gray-500">
            No favorite items found.
          </div>
        )}

        <div className="flex justify-end">
          <Button variant="destructive" className="px-4">
            Remove All
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default OverviewFavoriteList
