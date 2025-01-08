import React, { useState } from "react"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  handleDelete: () => void
  isPending: boolean
}

function DeleteDialog({ open, setOpen, handleDelete, isPending }: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()
  const message = `${locale === "vi" ? "xóa vĩnh viễn" : "delete permanently"}`

  const [value, setValue] = useState("")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-1">{t("Delete permanently")}</DialogTitle>
          <DialogDescription>
            <div
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
            onClick={handleDelete}
            disabled={value !== message || isPending}
            className="flex-1"
          >
            {t("Delete")}
            {isPending && <Loader2 className="ml-2 size-4" />}
          </Button>
          <Button
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

export default DeleteDialog
