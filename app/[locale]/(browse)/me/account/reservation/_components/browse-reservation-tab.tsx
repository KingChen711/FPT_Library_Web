import { useState } from "react"
import Image from "next/image"
import { addDays } from "date-fns"
import { Info } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import LibraryItemInfo from "@/components/ui/library-item-info"
import { dummyBooks } from "@/app/[locale]/(browse)/(home)/_components/dummy-books"

import { filteredItems } from "./dummy-reservation"
import LibraryReservationFilter from "./library-reservation-filter"
import ReservationForm from "./reservation-form"

interface LibraryItem {
  id: string
  title: string
  author: string
  type: "book" | "ebook" | "audiobook" | "journal" | "magazine" | "dvd"
  coverImage: string
  publishedYear: number
  publisher: string
  isbn?: string
  description: string
  categories: string[]
  available: boolean
  totalCopies: number
  availableCopies: number
  location: string
  popularity: number // 1-10 scale
  language: string
  pages?: number
  duration?: string // for audiobooks
}

const BrowseReservationTab = () => {
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null)
  const [reservationDate, setReservationDate] = useState<Date | undefined>(
    undefined
  )
  const [showReservationDialog, setShowReservationDialog] = useState(false)

  const handleReserve = (item: LibraryItem) => {
    console.log(123)
    setSelectedItem(item)
    setReservationDate(addDays(new Date(), 1)) // Default to tomorrow
    setShowReservationDialog(true)
  }

  return (
    <div>
      <ReservationForm
        reservationDate={reservationDate}
        setReservationDate={setReservationDate}
        selectedItem={selectedItem}
        showReservationDialog={showReservationDialog}
        setShowReservationDialog={setShowReservationDialog}
      />
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <CardTitle>Library Collection</CardTitle>
            <LibraryReservationFilter />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredItems.map((item: LibraryItem, index) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative aspect-[2/3]">
                  <Image
                    width={200}
                    height={300}
                    src={
                      dummyBooks[index % dummyBooks.length].image ||
                      "/placeholder.svg"
                    }
                    alt={`Cover for ${item.title}`}
                    className="size-full object-cover"
                  />
                  <div className="absolute right-2 top-2">
                    <Badge variant="secondary" className="capitalize">
                      {item.type}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="line-clamp-1 text-lg">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-1">
                    by {item.author}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 p-4 pt-0">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Published</span>
                    <span>{item.publishedYear}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Language</span>
                    <span>{item.language}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Availability</span>
                    <span
                      className={
                        item.availableCopies > 0
                          ? "text-green-600"
                          : "text-danger"
                      }
                    >
                      {item.availableCopies} of {item.totalCopies}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.categories.map((category) => (
                      <Badge
                        key={category}
                        variant="default"
                        className="text-xs"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between p-4 pt-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Info className="mr-2 size-4" />
                        Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="h-[90vh] overflow-y-auto sm:max-w-[70vw]">
                      <DialogHeader>
                        <DialogTitle>{item.title}</DialogTitle>
                        <DialogDescription>
                          by {item.author} ({item.publishedYear})
                        </DialogDescription>
                      </DialogHeader>

                      <LibraryItemInfo
                        id="1"
                        showInstances={false}
                        showResources={false}
                        showImage={true}
                      />

                      <DialogFooter>
                        <Button
                          onClick={() => handleReserve(item)}
                          disabled={item.availableCopies === 0}
                        >
                          {item.availableCopies > 0
                            ? "Reserve Now"
                            : "Not Available"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button
                    onClick={() => handleReserve(item)}
                    disabled={item.availableCopies === 0}
                  >
                    {item.availableCopies > 0 ? "Reserve" : "Unavailable"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BrowseReservationTab
