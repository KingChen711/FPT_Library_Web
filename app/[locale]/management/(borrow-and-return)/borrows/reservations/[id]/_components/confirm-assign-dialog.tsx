import React, { useState } from "react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Props = {
  isPending: boolean
  onAssignItem: () => void
  barcode: string
}

function ConfirmAssignDialog({ isPending, onAssignItem, barcode }: Props) {
  const t = useTranslations("BorrowAndReturnManagementPage")
  const [open, setOpen] = useState(false)

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={isPending} onClick={() => onAssignItem()}>
          {t("Select")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("Are you sure you want to select barcode to assign", {
              barcode,
            })}
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex gap-4">
          <DialogClose asChild>
            <Button type="button" className="flex-1" variant="outline">
              {t("Cancel")}
            </Button>
          </DialogClose>
          <Button type="button" className="flex-1" variant="outline">
            {t("Continue")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmAssignDialog
