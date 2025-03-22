import { LocalStorageKeys } from "@/constants"
import { useBorrowRequestStore } from "@/stores/borrows/use-borrow-request"
import { useTranslations } from "next-intl"

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
  const t = useTranslations("BookPage")
  const { selectedIds, toggleId } = useBorrowRequestStore()

  const handleSubmit = () => {
    localStorageHandler.setItem(LocalStorageKeys.BORROW, libraryItemId)
    if (selectedIds.includes(libraryItemId)) {
      toggleId(libraryItemId)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("are you absolutely sure to delete")}</DialogTitle>
          <DialogDescription>
            {t("delete")} &nbsp;
            <span className="font-semibold">
              &quot;
              {libraryItemTitle}&quot;
            </span>{" "}
            {t("from your borrow list? This action cannot be undone")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex items-center justify-end gap-2">
          <DialogClose>{t("cancel")}</DialogClose>
          <Button onClick={handleSubmit} variant={"destructive"}>
            {t("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteBorrowRequestConfirm
