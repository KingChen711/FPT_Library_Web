import { useLibraryStorage } from "@/contexts/library-provider"
import { useLocale, useTranslations } from "next-intl"

import { type LibraryItem } from "@/lib/types/models"
import { toast } from "@/hooks/use-toast"
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

const BorrowLibraryItemConfirm = ({ open, setOpen, libraryItem }: Props) => {
  const locale = useLocale()
  const t = useTranslations("BookPage")
  const { borrowedLibraryItems } = useLibraryStorage()

  const handleAddToBorrowList = () => {
    if (borrowedLibraryItems.has(libraryItem.libraryItemId)) {
      toast({
        title: locale === "vi" ? "Thất bại" : "Failed",
        description: t("added to borrow list"),
        variant: "info",
      })
    } else {
      borrowedLibraryItems.add(libraryItem.libraryItemId)
      toast({
        title: locale === "vi" ? "Thành công" : "Success",
        description: t("add borrow list"),
        variant: "default",
      })
    }
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

export default BorrowLibraryItemConfirm
