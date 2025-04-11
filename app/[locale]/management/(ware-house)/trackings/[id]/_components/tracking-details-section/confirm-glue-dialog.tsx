"use client"

import React, { useRef, useState, useTransition } from "react"
import { Loader2, Printer } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import Barcode from "react-barcode"
import { useReactToPrint } from "react-to-print"

import handleServerActionError from "@/lib/handle-server-action-error"
import { confirmHasGlued } from "@/actions/trackings/confirm-has-glued"
import useRangeBarcodes from "@/hooks/books/use-range-barcodes"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import GlueBarcodeInstructionsDialog from "@/components/ui/glue-barcode-instructions-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import NoData from "@/components/ui/no-data"

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
  trackingId: number
  trackingDetailId: number
}

function ConfirmGlueDialog({
  trackingId,
  trackingDetailId,
  open,
  setOpen,
}: Props) {
  const t = useTranslations("TrackingsManagementPage")
  const { data, isFetching } = useRangeBarcodes(trackingDetailId, open)

  const barcodesPrintRef = useRef<HTMLDivElement>(null)

  const handlePrintBarcodes = useReactToPrint({
    contentRef: barcodesPrintRef,
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-5xl">
        {isFetching ? (
          <div className="flex size-24 items-center justify-center">
            <Loader2 className="size-9 animate-spin" />
          </div>
        ) : data ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-start">
              <Label>{t("Glue barcode")}</Label>
              <Button
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handlePrintBarcodes()
                }}
                size="icon"
                variant="ghost"
              >
                <Printer className="text-primary" />
              </Button>
            </div>
            <div ref={barcodesPrintRef}>
              <div className="flex flex-col gap-2 border bg-white p-4 text-black">
                <Label>{t("Individual barcode")}</Label>
                <div className="flex flex-wrap">
                  {data.barcodes.map((barcode) => (
                    <div key={barcode} className="border border-black p-1">
                      <div className="flex flex-col items-center justify-center border-4 border-black">
                        <div className="flex flex-col">
                          <Barcode
                            value={barcode}
                            width={1.5}
                            height={24}
                            fontSize={16}
                            fontOptions="bold"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-2 border bg-white p-4 text-black">
                <Label>{t("Classification barcode")}</Label>
                <div className="flex flex-wrap">
                  {data.barcodes.map((barcode) => (
                    <div key={barcode} className="border border-black p-1">
                      <div className="flex flex-col items-center justify-center border-4 border-black">
                        <div className="flex items-end justify-center gap-2 px-2 py-1 text-sm font-bold">
                          E-Library
                        </div>

                        {(data.warehouseTrackingDetail?.libraryItem
                          ?.classificationNumber ||
                          data.warehouseTrackingDetail?.libraryItem
                            ?.cutterNumber ||
                          data.warehouseTrackingDetail?.libraryItem
                            ?.publicationYear) && (
                          <div className="flex h-[88px] w-full flex-col items-center justify-center border-t-4 border-black">
                            {data.warehouseTrackingDetail?.libraryItem
                              ?.classificationNumber && (
                              <p className="font-bold underline">
                                {
                                  data.warehouseTrackingDetail?.libraryItem
                                    ?.classificationNumber
                                }
                              </p>
                            )}
                            {data.warehouseTrackingDetail?.libraryItem
                              ?.cutterNumber && (
                              <p className="text-sm font-bold">
                                {
                                  data.warehouseTrackingDetail?.libraryItem
                                    ?.cutterNumber
                                }
                              </p>
                            )}
                            {data.warehouseTrackingDetail?.libraryItem
                              ?.publicationYear && (
                              <p className="text-sm font-bold">
                                {
                                  data.warehouseTrackingDetail?.libraryItem
                                    ?.publicationYear
                                }
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <GlueBarcodeInstructionsDialog />

            <div className="flex justify-end gap-4">
              <HasGluedDialog
                amount={data.barcodes.length}
                setParentOpen={setOpen}
                trackingId={trackingId}
                trackingDetailId={trackingDetailId}
              />
            </div>
          </div>
        ) : (
          <NoData />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmGlueDialog

type HasGluedDialogProps = {
  amount: number
  setParentOpen: (val: boolean) => void
  trackingId: number
  trackingDetailId: number
}

export function HasGluedDialog({
  amount,
  setParentOpen,
  trackingId,
  trackingDetailId,
}: HasGluedDialogProps) {
  const locale = useLocale()
  const t = useTranslations("TrackingsManagementPage")
  const tZod = useTranslations("Zod")
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState("")

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }

  const handleConfirm = () => {
    if (!value) {
      setError("min1")
      return
    }

    if (!Number(+value)) {
      setError("invalid")
      return
    }

    if (Number(+value) < amount) {
      setError("lessThanRequire")
      return
    }

    if (Number(+value) > amount) {
      setError("greaterThanRequire")
      return
    }

    startTransition(async () => {
      const res = await confirmHasGlued(trackingId, trackingDetailId)

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setOpen(false)
        setParentOpen(false)

        return
      }

      handleServerActionError(res, locale)
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>{t("Confirm has glued")}</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-2">
          <Label>{t("How many barcode has glue")}</Label>
          <Input
            disabled={isPending}
            type="number"
            value={value}
            onChange={(e) => {
              setError("")
              setValue(e.target.value)
            }}
          />
          {error && <p className="text-sm text-danger">{tZod(error)}</p>}

          <div className="flex justify-end gap-4">
            <Button disabled={isPending} onClick={handleConfirm}>
              {t("Confirm")}
              {isPending && <Loader2 className="ml-1 size-4 animate-spin" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
