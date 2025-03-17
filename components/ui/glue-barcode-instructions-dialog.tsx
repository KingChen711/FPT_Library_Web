import React from "react"
import Image from "next/image"
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

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="h-auto min-h-0 w-fit p-0">
          {t("Glue barcode instructions")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <AlertDialogHeader>
          <DialogTitle>{t("Glue barcode instructions")}</DialogTitle>
          <DialogDescription asChild>
            <div className="grid gap-8 md:grid-cols-2">
              <InstructionCard
                title={t("Individual barcode")}
                description={t("Individual barcode description")}
                imageSrc="/images/book-cover-label.svg"
              />

              <InstructionCard
                title={t("Classification barcode")}
                description={t("Classification barcode description")}
                imageSrc="/images/book-spine-label.svg"
              />
            </div>
          </DialogDescription>
        </AlertDialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default GlueBarcodeInstructionsDialog

interface InstructionCardProps {
  title: string
  description: string
  imageSrc: string
}

function InstructionCard({
  title,
  description,
  imageSrc,
}: InstructionCardProps) {
  return (
    <Card className="h-full rounded-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{description}</p>
        <div className="relative aspect-video overflow-hidden rounded-md bg-muted">
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt={title}
            fill
            className="object-contain p-4"
          />
        </div>
      </CardContent>
    </Card>
  )
}
