"use client"

import { type Dispatch, type SetStateAction } from "react"
import Image from "next/image"
import { addDays, isAfter, isBefore } from "date-fns"
import { Check } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { dummyBooks } from "@/app/[locale]/(browse)/(home)/_components/dummy-books"

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

type Props = {
  showReservationDialog: boolean
  setShowReservationDialog: (show: boolean) => void
  selectedItem: LibraryItem | null
  reservationDate: Date | undefined
  setReservationDate: Dispatch<SetStateAction<Date | undefined>>
}

const ReservationForm = ({
  reservationDate,
  setReservationDate,
  selectedItem,
  setShowReservationDialog,
  showReservationDialog,
}: Props) => {
  return (
    <div>
      <Dialog
        open={showReservationDialog}
        onOpenChange={setShowReservationDialog}
      >
        <DialogContent className="h-[90vh] overflow-y-auto sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reserve Library Item</DialogTitle>
            <DialogDescription>
              Select a date to pick up your reservation.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedItem && (
              <div className="flex items-start gap-3">
                <Image
                  src={dummyBooks[0].image || ""}
                  alt={"Selected Book"}
                  width={60}
                  height={90}
                  className="rounded-md object-cover"
                />
                <div>
                  <div className="font-medium">{selectedItem.title}</div>
                  <div className="text-sm text-muted-foreground">
                    by {selectedItem.author}
                  </div>
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="reservation-date">Pickup Date</Label>
              <div className="flex justify-center">
                <CalendarComponent
                  mode="single"
                  selected={reservationDate}
                  onSelect={setReservationDate}
                  disabled={(date) =>
                    isBefore(date, new Date()) ||
                    isAfter(date, addDays(new Date(), 30))
                  }
                  initialFocus
                />
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Items are held for pickup for 3 days from the selected date.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReservationDialog(false)}
            >
              Cancel
            </Button>
            <Button>
              <>
                <Check className="mr-2 size-4" />
                Confirm Reservation
              </>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ReservationForm
