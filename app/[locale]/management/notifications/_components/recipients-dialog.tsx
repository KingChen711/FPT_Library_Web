"use client"

import React, { useState } from "react"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

import useRecipients from "@/hooks/notifications/use-recipients"
import { Button } from "@/components/ui/button"
import Copitor from "@/components/ui/copitor"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Props = {
  notificationId: number
}

function RecipientsDialog({ notificationId }: Props) {
  const [open, setOpen] = useState(false)
  const t = useTranslations("NotificationsManagementPage")
  const { data, isFetching } = useRecipients(notificationId, open)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary">
          {t("View recipients")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="mb-1">{t("Recipients")}</DialogTitle>
          <DialogDescription asChild>
            <div className="mt-2 flex items-center gap-4">
              {isFetching && (
                <div className="flex justify-center">
                  <Loader2 className="size-9 animate-spin" />
                </div>
              )}
              {data
                ? data.map((r) => (
                    <div
                      key={r}
                      className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-muted-foreground"
                    >
                      <Copitor content={r} />
                      {r}
                    </div>
                  ))
                : null}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default RecipientsDialog
