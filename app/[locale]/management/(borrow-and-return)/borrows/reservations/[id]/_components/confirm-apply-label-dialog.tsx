"use client"

import React, { useRef, useTransition } from "react"
import { format } from "date-fns"
import { Loader2, Printer } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useReactToPrint } from "react-to-print"

import handleServerActionError from "@/lib/handle-server-action-error"
import { confirmApplyLabel } from "@/actions/borrows/confirm-apply-label"
import { toast } from "@/hooks/use-toast"
import useFormatLocale from "@/hooks/utils/use-format-locale"
import BarcodeGenerator from "@/components/ui/barcode-generator"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
  reservationId: number
  reservationCode: string | null
  reservationDate: Date
  assignedDate: Date | null
  expiryDate: Date | null
  fullName: string
  cardBarcode: string
}

function ConfirmApplyLabelDialog({
  fullName,
  reservationCode,
  reservationDate,
  reservationId,
  open,
  cardBarcode,
  assignedDate,
  expiryDate,
  setOpen,
}: Props) {
  const t = useTranslations("BorrowAndReturnManagementPage")

  const locale = useLocale()
  const formatLocale = useFormatLocale()
  const [isPending, startTransition] = useTransition()

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }

  const handleConfirmApplyLabel = () => {
    startTransition(async () => {
      const res = await confirmApplyLabel(reservationId, reservationCode!)
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

  const barcodesPrintRef = useRef<HTMLDivElement>(null)

  const handlePrintBarcodes = useReactToPrint({
    contentRef: barcodesPrintRef,
  })

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[80vh] w-fit max-w-3xl overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>
            {t("Confirm apply label")}
            <Button
              onClick={() => handlePrintBarcodes()}
              variant="ghost"
              size="icon"
              className="text-primary"
            >
              <Printer />
            </Button>
          </DialogTitle>
          <DialogDescription asChild>
            <div>
              <div
                ref={barcodesPrintRef}
                className="w-[400px] rounded-md border"
              >
                <div className="space-y-4 p-4">
                  <div className="rounded-md bg-warning p-3 text-center">
                    <p className="font-bold text-danger">
                      {t("Reservation code")}: {reservationCode}
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {t("Fullname")}:
                      </p>
                      <p className="font-medium">{fullName}</p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {t("Reservation date")}:
                      </p>
                      <p className="font-medium">
                        {format(new Date(reservationDate), "dd MMM yyyy", {
                          locale: formatLocale,
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-between gap-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {t("Assigned date")}:
                      </p>
                      <p className="font-medium">
                        {assignedDate
                          ? format(new Date(assignedDate), "dd MMM yyyy", {
                              locale: formatLocale,
                            })
                          : null}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {t("Expired date")}:
                      </p>
                      <p className="font-medium">
                        {expiryDate
                          ? format(new Date(expiryDate), "dd MMM yyyy", {
                              locale: formatLocale,
                            })
                          : null}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {t("Patron card code")}:
                    </p>
                    <div className="flex justify-center">
                      <BarcodeGenerator
                        value={cardBarcode}
                        options={{
                          format: "CODE128",
                          displayValue: true,
                          fontSize: 12,
                          width: 1,
                          height: 24,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button disabled={isPending} onClick={handleConfirmApplyLabel}>
                  {t("Confirm")}
                  {isPending && (
                    <Loader2 className="ml-1 size-4 animate-spin" />
                  )}
                </Button>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmApplyLabelDialog
