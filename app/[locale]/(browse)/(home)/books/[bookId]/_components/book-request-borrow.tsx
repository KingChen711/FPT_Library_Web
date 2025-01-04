import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
  bookRequestBorrowSchema,
  BORROW_OPTIONS,
  type TBookRequestBorrowSchema,
} from "@/lib/validations/book/book-borrow"
import BookPreview from "@/components/ui/book-preview"
import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { BookQrDialog } from "./book-qr-dialog"

const BookRequestBorrow = () => {
  const [bookFile, setBookFile] = useState<File | null>(null)
  const [openBookQr, setOpenBookQr] = useState(false)

  const form = useForm<TBookRequestBorrowSchema>({
    resolver: zodResolver(bookRequestBorrowSchema),
    defaultValues: {
      borrowOption: BORROW_OPTIONS.REQUEST,
      borrowPickupDate: "",
      borrowReturnDate: "",
      searchBook: "",
      description: "",
    },
  })

  const handleFileSelection = (file: File | null) => {
    setBookFile(file)

    if (file) {
      const randomSerial = Math.floor(
        100000 + Math.random() * 900000
      ).toString()
      form.setValue("searchBook", randomSerial)
      form.clearErrors("searchBook")
    }
  }

  const onSubmit = async (values: TBookRequestBorrowSchema) => {
    console.log("Form submitted with values:", values)
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-6">
          <div className="flex items-center justify-between gap-x-4">
            <FormField
              control={form.control}
              name="borrowPickupDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Pickup date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="borrowReturnDate"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Return date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="searchBook"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Search book</FormLabel>
                <FormControl>
                  <div className="relative h-10 w-full">
                    <BookQrDialog
                      open={openBookQr}
                      setOpen={setOpenBookQr}
                      onFileSelect={handleFileSelection}
                    />
                    <Input
                      {...field}
                      type="text"
                      className="pl-10"
                      placeholder="Search book"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {bookFile && <BookPreview objectUrl={bookFile} />}

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="Enter description" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-x-4">
            <Button type="submit">Borrow</Button>
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default BookRequestBorrow
