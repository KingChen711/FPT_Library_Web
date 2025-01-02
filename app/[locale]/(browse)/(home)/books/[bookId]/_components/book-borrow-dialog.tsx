"use client"

import { useState } from "react"
import { BookOpen, CalendarIcon, QrCode } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const BookBorrowDialog = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"default"}>
          <BookOpen /> <span className="border-l-2 pl-2">Borrow</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-primary">
            Book Borrow Confirmation
          </DialogTitle>
        </DialogHeader>
        <section>
          <Label>Option(*)</Label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Borrowing" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">In library borrowing</SelectItem>
              <SelectItem value="2">Request to borrow</SelectItem>
            </SelectContent>
          </Select>
        </section>

        <section>
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className="w-full">
                <span>Pick a Date</span>
                <CalendarIcon className="ml-auto size-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" initialFocus />
            </PopoverContent>
          </Popover>
        </section>

        <section>
          <Label>Book Serial No. *</Label>
          <div className="relative h-10 w-full">
            <QrCode
              size={24}
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-primary"
            />
            <Input
              type="text"
              placeholder="Enter 6 digit serial No. or Scan barcode"
              className="w-full rounded border border-gray-300 py-2 pl-12 pr-3 text-lg shadow-sm"
            />
          </div>
        </section>

        <section>
          <Label>Description</Label>
          <Textarea
            className="w-full rounded border border-gray-300 py-2 text-lg shadow-sm"
            placeholder="Enter description"
            rows={3}
          />
        </section>

        <div className="flex items-center gap-4">
          <Button>Borrow</Button>
          <Button variant={"secondary"}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BookBorrowDialog
