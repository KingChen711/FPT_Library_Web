"use client"

import { useLibraryStorage } from "@/contexts/library-provider"
import { useTranslations } from "next-intl"

import { EResourceBookType } from "@/lib/types/enums"
import { type BookResource } from "@/lib/types/models"
import { cn, formatPrice } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
  selectedResource: BookResource
}

const BorrowDigitalConfirm = ({ open, setOpen, selectedResource }: Props) => {
  const t = useTranslations("BookPage")

  const { borrowedResources } = useLibraryStorage()

  const isAdded = borrowedResources.has(selectedResource.resourceId)

  const handleBorrowDigital = () => {
    borrowedResources.toggle(selectedResource.resourceId)
    toast({
      title: isAdded ? t("deleted to borrow list") : t("added to borrow list"),
      variant: "info",
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn("sm:max-w-xl", {
          paymentData: "sm:max-w-2xl",
        })}
      >
        <DialogHeader>
          <DialogTitle>{t("add resource to borrow list")}</DialogTitle>
        </DialogHeader>
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h3 className="line-clamp-1 text-lg font-medium">
                {selectedResource.resourceTitle}
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant={"draft"} className="text-xs">
                  {selectedResource.resourceType === EResourceBookType.EBOOK
                    ? t("ebook")
                    : t("audio book")}
                </Badge>
              </div>
            </div>
            {selectedResource.borrowPrice &&
              selectedResource.borrowPrice > 0 && (
                <Badge variant="default" className="font-semibold">
                  {formatPrice(selectedResource.borrowPrice)}
                </Badge>
              )}
          </div>

          {selectedResource.defaultBorrowDurationDays && (
            <p className="mt-2 text-sm text-muted-foreground">
              {t("borrow duration")}:{" "}
              {selectedResource.defaultBorrowDurationDays} {t("days")}
            </p>
          )}
        </Card>
        <DialogFooter className="flex items-center justify-end gap-4">
          <DialogClose>{t("cancel")}</DialogClose>
          <Button onClick={handleBorrowDigital}>
            {t(isAdded ? "delete" : "add")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default BorrowDigitalConfirm
