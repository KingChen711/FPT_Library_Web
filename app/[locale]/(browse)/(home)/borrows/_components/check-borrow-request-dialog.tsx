"use client"

import React, { useTransition } from "react"
import { userBorrowRequestStore } from "@/stores/borrows/use-borrow-request"
import { Loader2 } from "lucide-react"

import useCheckAvailableBorrowRequest from "@/hooks/borrow/use-check-available-borrow-request"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import NotAllowBorrowCard from "./not-allowed-borrow-card"

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
}

const CheckBorrowRequestDialog = ({ open, setOpen }: Props) => {
  const { selectedIds } = userBorrowRequestStore()
  const [isPending, startTransition] = useTransition()

  const { data, isLoading } = useCheckAvailableBorrowRequest(selectedIds)

  const isAllowedBorrowRequest: boolean =
    data?.alreadyBorrowedItems.length === 0 &&
    data?.alreadyRequestedItems.length === 0 &&
    data?.alreadyReservedItems.length === 0
  console.log(
    "🚀 ~ CheckBorrowRequestDialog ~ isAllowedBorrowRequest:",
    isAllowedBorrowRequest
  )

  if (isLoading) {
    return <Loader2 className="size-6 animate-spin" />
  }

  console.log("🚀 ~ CheckBorrowRequestDialog ~ data:", data)
  const handleSubmit = () => {
    startTransition(() => {})
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Your borrow list?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>

        {isAllowedBorrowRequest && (
          <div className="flex flex-col gap-2">
            <div>
              <h1 className="font-semibold">Allow to borrow</h1>
              {data?.allowToBorrowItems.map((item) => (
                <div key={item.libraryItemId}>
                  <p>{item.title}</p>
                </div>
              ))}
            </div>

            <div>
              <h1 className="font-semibold">Allow to reserve</h1>
              {data?.allowToReserveItems.map((item) => (
                <div key={item.libraryItemId}>
                  <p>{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isAllowedBorrowRequest && selectedIds.length > 0 && (
          <div className="flex flex-col gap-2">
            <div>
              <h1 className="font-semibold">Already Requested Items</h1>
              {data?.alreadyRequestedItems.map((item) => (
                <NotAllowBorrowCard
                  key={item.libraryItemId}
                  libraryItem={item}
                />
              ))}
            </div>

            <div>
              <h1 className="font-semibold">Already Borrow Items</h1>
              {data?.alreadyBorrowedItems.map((item) => (
                <NotAllowBorrowCard
                  key={item.libraryItemId}
                  libraryItem={item}
                />
              ))}
            </div>

            <div>
              <h1 className="font-semibold">Already Reserve Items</h1>
              {data?.alreadyReservedItems.map((item) => (
                <NotAllowBorrowCard
                  key={item.libraryItemId}
                  libraryItem={item}
                />
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="flex items-center justify-end gap-2">
          <DialogClose>Cancel</DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={!isAllowedBorrowRequest || isPending}
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CheckBorrowRequestDialog
