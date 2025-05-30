import React, { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { editShelfLocation } from "@/actions/books/editions/edit-shelf-location"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

import ShelfSelector from "../../_components/shelf-selector"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  bookId: number
  initShelfId: number | null | undefined
  initShelfName: string | null | undefined
}

function EditShelfDialog({
  bookId,
  open,
  setOpen,
  initShelfId,
  initShelfName,
}: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()
  const [pending, startTransition] = useTransition()

  const [shelfId, setShelfId] = useState<number | undefined>(
    initShelfId || undefined
  )

  const [openSelector, setOpenSelector] = useState(false)

  const handleEditShelf = () => {
    if (!shelfId) {
      toast({
        title: locale === "vi" ? "Thành công" : "Success",
        description:
          locale === "vi" ? "Vui lòng chọn 1 kệ sách" : "Please select a shelf",
        variant: "warning",
      })
      return
    }

    startTransition(async () => {
      const res = await editShelfLocation({ bookId, shelfId })
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setOpen(false)
        return
      }
      handleServerActionError(res, locale)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[80vh] max-w-3xl overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="mb-1">{t("Edit shelf")}</DialogTitle>
          <DialogDescription>
            <Label className="mb-2">{t("Shelf")}</Label>
            <ShelfSelector
              onChange={setShelfId}
              initShelfName={initShelfName || undefined}
              open={openSelector}
              setOpen={setOpenSelector}
              libraryItemId={bookId}
            />
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4">
          <Button
            disabled={pending || openSelector}
            className="flex-1"
            onClick={() => {
              setOpen(false)
            }}
            variant="secondary"
          >
            {t("Cancel")}
          </Button>
          <Button
            onClick={handleEditShelf}
            disabled={pending || openSelector}
            className="flex-1"
          >
            {t("Save")}
            {pending && <Loader2 className="ml-2 size-4 animate-spin" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditShelfDialog
