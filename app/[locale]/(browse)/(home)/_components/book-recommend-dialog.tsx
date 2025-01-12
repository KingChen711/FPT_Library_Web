"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
}

const BookRecommendDialog = ({ open, setOpen }: Props) => {
  const handleOnChange = (value: boolean) => {
    setOpen(value)
  }

  return (
    <Dialog open={open} onOpenChange={handleOnChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book Recommend</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default BookRecommendDialog
