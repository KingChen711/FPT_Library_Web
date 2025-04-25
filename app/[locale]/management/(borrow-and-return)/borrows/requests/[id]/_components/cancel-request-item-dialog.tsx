import React, { useState } from "react"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type Props = {
  title: string
  onCancel: () => void
  setOpen: (val: boolean) => void
  isPending: boolean
}

function CancelRequestItemDialog({
  title,
  onCancel,
  setOpen,
  isPending,
}: Props) {
  const locale = useLocale()

  const message = `${locale === "vi" ? "hủy" : "cancel"}`
  const t = useTranslations("BorrowAndReturnManagementPage")
  const [value, setValue] = useState("")

  return (
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
          disabled={value !== message || isPending}
          className="flex-1"
        >
          {t("Continue")}
          {isPending && <Loader2 className="ml-2 size-4 animate-spin" />}
        </Button>
      </div>
    </DialogContent>
  )
}

export default CancelRequestItemDialog
