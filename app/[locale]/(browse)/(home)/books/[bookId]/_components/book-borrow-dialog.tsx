"use client"

import { useState } from "react"
import { Book } from "lucide-react"
import { useTranslations } from "next-intl"

import { BORROW_OPTIONS } from "@/lib/validations/book/book-borrow"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import BookLibraryBorrow from "./book-library-borrow"
import BookRequestBorrow from "./book-request-borrow"

const BookBorrowDialog = () => {
  const t = useTranslations("BookPage")

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [borrowOption, setBorrowOption] = useState<BORROW_OPTIONS>(
    BORROW_OPTIONS.LIBRARY
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"default"}>
          <Book /> <span>{t("borrow")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-center capitalize text-primary">
            {t("book borrow confirmation")}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[80vh] overflow-y-auto">
          <section className="space-y-2">
            <Label>{t("option")}(*)</Label>
            <Select
              value={borrowOption}
              onValueChange={(value: BORROW_OPTIONS) => setBorrowOption(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Borrowing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={BORROW_OPTIONS.LIBRARY}>
                  {t("in library borrowing")}
                </SelectItem>
                <SelectItem value={BORROW_OPTIONS.REQUEST}>
                  {t("request to borrow")}
                </SelectItem>
              </SelectContent>
            </Select>
          </section>

          {borrowOption === BORROW_OPTIONS.LIBRARY && <BookLibraryBorrow />}
          {borrowOption === BORROW_OPTIONS.REQUEST && <BookRequestBorrow />}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BookBorrowDialog
