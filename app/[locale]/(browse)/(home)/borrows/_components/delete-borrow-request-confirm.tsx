import { type Dispatch, type SetStateAction } from "react"
import { useLibraryStorage } from "@/contexts/library-provider"
import { useTranslations } from "next-intl"

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

import { type SelectedBorrow } from "../page"

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
  id: number
  libraryItemTitle: string
  type: "library-item" | "resource"
  setSelectedBorrow: Dispatch<SetStateAction<SelectedBorrow>>
}

const DeleteBorrowRequestConfirm = ({
  open,
  setOpen,
  id,
  libraryItemTitle,
  type,
  setSelectedBorrow,
}: Props) => {
  const t = useTranslations("BookPage")

  const { borrowedLibraryItems, borrowedResources } = useLibraryStorage()
  const handleSubmit = () => {
    if (type === "library-item") {
      borrowedLibraryItems.remove(id)
      borrowedLibraryItems.refresh()
      setSelectedBorrow((prev) => {
        if (prev.selectedLibraryItemIds.includes(id)) {
          return {
            ...prev,
            selectedLibraryItemIds: prev.selectedLibraryItemIds.filter(
              (id) => id !== id
            ),
          }
        }
        return prev
      })
    }
    if (type === "resource") {
      borrowedResources.remove(id)
      borrowedResources.refresh()
      setSelectedBorrow((prev) => {
        if (prev.selectedResourceIds.includes(id)) {
          return {
            ...prev,
            selectedResourceIds: prev.selectedResourceIds.filter(
              (id) => id !== id
            ),
          }
        }
        return prev
      })
    }
    setOpen(false)
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
            </span>
            &nbsp;
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
