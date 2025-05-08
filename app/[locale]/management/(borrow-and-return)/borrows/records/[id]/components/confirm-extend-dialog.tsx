"use client"

import React, { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { extendBorrowItem } from "@/actions/borrow-records/extend-borrow-item"
import { extendBorrowItemPatron } from "@/actions/borrow-records/extend-borrow-item-patron"
import { toast } from "@/hooks/use-toast"
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
import { Icons } from "@/components/ui/icons"

type Props = {
  itemName: string
  management?: boolean
  recordId: number
  recordDetailId: number
}

function ConfirmExtendDialog({
  itemName,
  management = false,
  recordId,
  recordDetailId,
}: Props) {
  const [open, setOpen] = useState(false)
  const locale = useLocale()
  const t = useTranslations("TrackingsManagementPage")
  const [isPending, startTransition] = useTransition()

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }

  const handleExtend = () => {
    startTransition(async () => {
      const res = management
        ? await extendBorrowItem(recordDetailId, recordId)
        : await extendBorrowItemPatron(recordDetailId, recordId)

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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Icons.Upgrade className="size-4" />
          {t("Extend")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("Are you sure you want to extend", {
              itemName,
            })}
          </DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex gap-4">
          <DialogClose asChild>
            <Button
              disabled={isPending}
              type="button"
              className="flex-1"
              variant="outline"
            >
              {t("Cancel")}
            </Button>
          </DialogClose>
          <Button
            disabled={isPending}
            type="button"
            className="flex-1"
            onClick={handleExtend}
          >
            {t("Continue")}
            {isPending && <Loader2 className="size-4 animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmExtendDialog
