import React, { useState } from "react"
import Image from "next/image"
import BookCoverLabel from "@/public/images/book-cover-label.svg"
import BookSpineLabel from "@/public/images/book-spine-label.svg"
import { useTranslations } from "next-intl"

import { AlertDialogHeader } from "./alert-dialog"
import { Button } from "./button"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./dialog"

function GlueBarcodeInstructionsDialog() {
  const t = useTranslations("TrackingsManagementPage")
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setOpen(true)
          }}
          variant="link"
          className="h-auto min-h-0 w-fit p-0"
        >
          {t("Glue barcode instructions")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <AlertDialogHeader>
          <DialogTitle>{t("Glue barcode instructions")}</DialogTitle>
          <DialogDescription asChild>
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="h-full rounded-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {t("Individual barcode")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    {t("Individual barcode description")}
                  </p>
                  <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
                    <Image
                      src={BookCoverLabel}
                      alt={t("Individual barcode")}
                      fill
                      priority
                      className="object-contain p-4"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full rounded-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {t("Classification barcode")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    {t("Classification barcode description")}
                  </p>
                  <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
                    <Image
                      src={BookSpineLabel}
                      alt={t("Classification barcode")}
                      fill
                      priority
                      className="object-contain p-4"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogDescription>
        </AlertDialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default GlueBarcodeInstructionsDialog
