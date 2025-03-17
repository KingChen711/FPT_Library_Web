import { LocalStorageKeys } from "@/constants"

import { localStorageHandler } from "@/lib/utils"
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

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
  libraryItemId: string
  libraryItemTitle: string
}

const DeleteBorrowRequestConfirm = ({
  open,
  setOpen,
  libraryItemId,
  libraryItemTitle,
}: Props) => {
  const handleSubmit = () => {
    localStorageHandler.setItem(LocalStorageKeys.BORROW, libraryItemId)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure to delete?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will delete &nbsp;
            <span className="font-semibold">
              &quot;
              {libraryItemTitle}&quot;
            </span>
            &nbsp; from your borrow list.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex items-center justify-end gap-2">
          <DialogClose>Cancel</DialogClose>
          <Button onClick={handleSubmit} variant={"destructive"}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteBorrowRequestConfirm
