"use client"

// Types
import Image from "next/image"
import { differenceInDays, format } from "date-fns"
import { Check, Loader2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { dummyBooks } from "@/app/[locale]/(browse)/(home)/_components/dummy-books"

import { type BorrowedItem } from "./dummy-return"

type Props = {
  showReturnDialog: boolean
  setShowReturnDialog: (value: boolean) => void
  selectedItem: BorrowedItem
}

const formatDate = (dateString: string): string => {
  return format(new Date(dateString), "MMM dd, yyyy")
}

const getDaysUntilDue = (dueDate: string): number => {
  const today = new Date()
  const due = new Date(dueDate)
  return differenceInDays(due, today)
}

const ReturnBorrowedForm = ({
  selectedItem,
  showReturnDialog,
  setShowReturnDialog,
}: Props) => {
  return (
    <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Return Library Item</DialogTitle>
          <DialogDescription>
            Please confirm the return details for this item.
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
                <div className="font-medium">{selectedItem.item.title}</div>
                <div className="text-sm text-muted-foreground">
                  by {selectedItem.item.author}
                </div>
                <div className="text-xs text-muted-foreground">
                  ID: {selectedItem.id}
                </div>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="condition">Item Condition</Label>
            <Select>
              <SelectTrigger id="condition">
                <SelectValue>Select condition</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="damaged">Damaged</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              placeholder="Add any notes about the condition..."
            />
          </div>
          {selectedItem && selectedItem.lateFee > 0 && (
            <div className="rounded-md bg-red-50 p-3 text-sm">
              <p className="font-medium text-red-800">
                Late Fee: ${selectedItem.lateFee.toFixed(2)}
              </p>
              <p className="mt-1 text-red-700">
                This item was due on {formatDate(selectedItem.dueDate)} and is{" "}
                {Math.abs(getDaysUntilDue(selectedItem.dueDate))} days overdue.
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>
            <>
              <Check className="mr-2 size-4" />
              Confirm Return
            </>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ReturnBorrowedForm
