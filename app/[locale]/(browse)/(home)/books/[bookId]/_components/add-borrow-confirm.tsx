import { LocalStorageKeys } from "@/constants"
import { useBorrowRequestStore } from "@/stores/borrows/use-borrow-request"
import { useTranslations } from "next-intl"

import { type LibraryItem } from "@/lib/types/models"
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
  libraryItem: LibraryItem
}

const AddBorrowConfirm = ({ open, setOpen, libraryItem }: Props) => {
  const { selectedLibraryItemIds: selectedIds } = useBorrowRequestStore()
  console.log("🚀 ~ AddBorrowConfirm ~ selectedIds:", selectedIds)
  const t = useTranslations("BookPage")

  const handleAddToBorrowList = () => {
    localStorageHandler.setItem(
      LocalStorageKeys.BORROW_LIBRARY_ITEM_IDS,
      libraryItem.libraryItemId.toString()
    )
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("add borrow list")}</DialogTitle>
          <DialogDescription>
            {t("add to borrow list", {
              title: libraryItem.title,
            })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex items-center justify-end gap-2">
          <DialogClose>{t("cancel")}</DialogClose>
          <Button onClick={handleAddToBorrowList}>{t("add")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddBorrowConfirm
