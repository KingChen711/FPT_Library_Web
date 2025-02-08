import React, { useState, useTransition } from "react"
import { Dialog } from "@radix-ui/react-dialog"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { deleteTracking } from "@/actions/trackings/delete-tracking"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  trackingId: number
  title: string
}

function DeleteTrackingDialog({ open, setOpen, trackingId, title }: Props) {
  const t = useTranslations("TrackingsManagementPage")
  const locale = useLocale()
  const message = `${locale === "vi" ? "xóa" : "delete"} ${title}`

  const [value, setValue] = useState("")

  const [pending, startTransition] = useTransition()

  const handleDeleteTracking = () => {
    startTransition(async () => {
      const res = await deleteTracking(trackingId)
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-1">{t("Delete tracking")}</DialogTitle>
          <DialogDescription>
            <div
              dangerouslySetInnerHTML={{
                __html: t.markup("type to confirm", {
                  message: () => `<strong>${message}</strong>`,
                }),
              }}
            ></div>
            <Input
              disabled={pending}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mt-2"
            />
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4">
          <Button
            onClick={handleDeleteTracking}
            disabled={value !== message || pending}
            className="flex-1"
          >
            {t("Delete")}
            {pending && <Loader2 className="ml-2 size-4" />}
          </Button>
          <Button
            disabled={pending}
            className="flex-1"
            onClick={() => {
              setOpen(false)
            }}
            variant="secondary"
          >
            {t("Cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteTrackingDialog
