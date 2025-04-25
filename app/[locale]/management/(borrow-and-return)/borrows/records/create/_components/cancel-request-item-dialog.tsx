import React, { useState } from "react"
import { Loader2, Trash2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type Props = {
  title: string
  onCancel: () => void
  cancelling: boolean
}

function CancelRequestItemDialog({ title, cancelling, onCancel }: Props) {
  const locale = useLocale()
  const message = `${locale === "vi" ? "hủy" : "cancel"}`
  const t = useTranslations("BorrowAndReturnManagementPage")
  const [value, setValue] = useState("")

  const [open, setOpen] = useState(false)

  const handleOpenChange = (value: boolean) => {
    if (cancelling) return
    setOpen(value)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          onClick={() => {
            setOpen(true)
          }}
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
        >
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-1">
            {t("Cancel request item", { title })}
          </DialogTitle>
          <DialogDescription>
            <div
              className="select-none"
              dangerouslySetInnerHTML={{
                __html: t.markup("type to confirm", {
                  message: () => `<strong>${message}</strong>`,
                }),
              }}
            ></div>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="mt-2"
            />
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4">
          <Button
            className="flex-1"
            onClick={() => {
              setOpen(false)
            }}
            variant="secondary"
          >
            {t("Cancel")}
          </Button>
          <Button
            onClick={onCancel}
            disabled={value !== message || cancelling}
            className="flex-1"
          >
            {t("Continue")}
            {cancelling && <Loader2 className="ml-2 size-4 animate-spin" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CancelRequestItemDialog
