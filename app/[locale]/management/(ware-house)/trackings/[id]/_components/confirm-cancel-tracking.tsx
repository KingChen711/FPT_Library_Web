import React from "react"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Props = {
  isPending: boolean
  onCancelTracking: () => void
  receipt: string
  open: boolean
  setOpen: (val: boolean) => void
  supplementRequest?: boolean
}

function ConfirmCancelTrackingDialog({
  isPending,
  onCancelTracking,
  receipt,
  open,
  setOpen,
  supplementRequest = false,
}: Props) {
  const t = useTranslations("TrackingsManagementPage")

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {supplementRequest
              ? t("Are you sure you want to cancel supplement request", {
                  receipt,
                })
              : t("Are you sure you want to cancel warehouse tracking", {
                  receipt,
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
            onClick={onCancelTracking}
          >
            {t("Continue")}
            {isPending && <Loader2 className="size-4 animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmCancelTrackingDialog
