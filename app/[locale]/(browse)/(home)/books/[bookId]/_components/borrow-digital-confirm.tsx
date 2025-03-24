"use client"

import { useEffect, useState } from "react"
import { LocalStorageKeys } from "@/constants"
import { BadgeCheck } from "lucide-react"
import { useTranslations } from "next-intl"

import { EResourceBookType } from "@/lib/types/enums"
import { type BookResource } from "@/lib/types/models"
import { cn, formatPrice, localStorageHandler } from "@/lib/utils"
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
  const [borrowResourceIds, setBorrowResourcesIds] = useState<string[]>([])

  const updateBorrows = () => {
    setBorrowResourcesIds(
      localStorageHandler.getItem(LocalStorageKeys.BORROW_RESOURCE_IDS)
    )
  }

  useEffect(() => {
    updateBorrows()
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === LocalStorageKeys.BORROW_RESOURCE_IDS) {
        updateBorrows()
      }
    }
    const handleCustomEvent = () => updateBorrows()
    window.addEventListener("storage", handleStorageChange)

    window.addEventListener(
      LocalStorageKeys.BORROW_RESOURCE_IDS,
      handleCustomEvent
    )
    return () => {
      window.removeEventListener("storage", handleStorageChange)

      window.removeEventListener(
        LocalStorageKeys.BORROW_RESOURCE_IDS,
        handleCustomEvent
      )
    }
  }, [])

  const isAdded = borrowResourceIds.includes(
    selectedResource.resourceId.toString()
  )

  const handleBorrowDigital = () => {
    localStorageHandler.setItem(
      LocalStorageKeys.BORROW_RESOURCE_IDS,
      selectedResource.resourceId.toString()
    )
    toast({
      title: isAdded ? t("deleted to borrow list") : t("added to borrow list"),
      variant: "default",
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
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold sm:text-xl">
            <BadgeCheck className="size-5 text-success" />
            {t("add resource to borrow list")}
          </DialogTitle>
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
