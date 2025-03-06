import React, { useState } from "react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {
  handleGenerateCutterNumber: (text: string) => void
}

function GenerateCutterNumberDialog({ handleGenerateCutterNumber }: Props) {
  const t = useTranslations("BooksManagementPage")
  const [text, setText] = useState("")
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Icons.Wand className="size-4" />
          {t("Generate cutter number")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2">
            {t("Generate cutter number")}
          </DialogTitle>
          <DialogDescription>
            <Label>{t("Text")}</Label>
            <Input
              value={text}
              className="mt-1"
              onChange={(e) => setText(e.target.value)}
              placeholder={t("Enter book title or author's last name")}
            />
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex w-full items-center gap-4">
            <DialogClose asChild>
              <Button variant="outline" type="submit" className="flex-1">
                {t("Cancel")}
              </Button>
            </DialogClose>
            <Button
              onClick={() => {
                handleGenerateCutterNumber(text)
                setText("")
                setOpen(false)
              }}
              type="submit"
              className="flex-1"
            >
              {t("Confirm")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default GenerateCutterNumberDialog
