"use client"

import React, { useTransition } from "react"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import Barcode from "react-barcode"

import handleServerActionError from "@/lib/handle-server-action-error"
import { assignItem } from "@/actions/borrows/assign-item"
import useAssignableItems from "@/hooks/borrow/use-assignable-items"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import NoResult from "@/components/ui/no-result"
import BookCopyStatusBadge from "@/components/badges/book-copy-status-badge"
import ShelfBadge from "@/components/badges/shelf-badge"

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
  reservationId: number
  setOpenConfirmApply: (val: boolean) => void
}

function AssignItemDialog({
  reservationId,
  open,
  setOpen,
  setOpenConfirmApply,
}: Props) {
  const t = useTranslations("BorrowAndReturnManagementPage")

  const locale = useLocale()
  const [isPending, startTransition] = useTransition()

  const { data: assignableItems, isLoading } = useAssignableItems(
    reservationId,
    open
  )

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }

  const handleAssignItem = (instanceId: number) => {
    startTransition(async () => {
      const res = await assignItem(reservationId, instanceId)

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setOpen(false)
        setOpenConfirmApply(true)
        return
      }

      handleServerActionError(res, locale)
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[80vh] w-fit max-w-3xl overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>{t("Assign item")}</DialogTitle>
          <DialogDescription asChild>
            <>
              {isLoading ||
                (isPending && (
                  <div className="flex w-40 justify-center">
                    <Loader2 className="size-9 animate-spin" />
                  </div>
                ))}
              {!isLoading &&
                !isPending &&
                assignableItems &&
                (assignableItems?.length === 0 ? (
                  <div className="flex justify-center">
                    <NoResult
                      title={t("Assignable items not found")}
                      description={t(
                        "There is currently no suitable item to assign"
                      )}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 pt-4">
                    {assignableItems.map((item) => (
                      <div
                        className="flex w-fit items-center gap-6 rounded-md border p-4"
                        key={item.libraryItemInstance.barcode}
                      >
                        {/* <div className="flex min-w-48 flex-col">
                          <div className="flex flex-row items-center justify-between gap-2">
                            <div className="font-bold">{t("Floor")}: </div>
                            <div>{item.shelfDetail.floor.floorNumber}</div>
                          </div>
                          <div className="flex flex-row items-center justify-between gap-2">
                            <div className="font-bold">{t("Zone")}: </div>
                            <div>
                              {locale === "vi"
                                ? item.shelfDetail.zone.vieZoneName
                                : item.shelfDetail.zone.engZoneName}
                            </div>
                          </div>
                          <div className="flex flex-row items-center justify-between gap-2">
                            <div className="font-bold">{t("Section")}: </div>
                            <div>
                              {locale === "vi"
                                ? item.shelfDetail.section.vieSectionName
                                : item.shelfDetail.section.engSectionName}
                            </div>
                          </div>
                          <div className="flex flex-row items-center justify-between gap-2">
                            <div className="font-bold">{t("Shelf")}: </div>
                            <div>
                              {item.shelfDetail.libraryShelf.shelfNumber}
                            </div>
                          </div>
                        </div> */}
                        <div className="flex min-w-48 flex-col gap-2">
                          <div className="flex flex-row items-center justify-between gap-2">
                            <div className="font-bold">{t("Condition")}: </div>
                            <div>
                              {locale === "vi"
                                ? item.libraryItemInstance
                                    .libraryItemConditionHistories[0].condition
                                    ?.vietnameseName
                                : item.libraryItemInstance
                                    .libraryItemConditionHistories[0].condition
                                    ?.englishName}
                            </div>
                          </div>
                          <div className="flex flex-row items-center justify-between gap-2">
                            <div className="font-bold">{t("Status")}: </div>
                            <div>
                              <BookCopyStatusBadge
                                status={item.libraryItemInstance.status}
                              />
                            </div>
                          </div>
                          <div className="flex flex-row items-center justify-between gap-2">
                            <div className="font-bold">{t("Shelf")}: </div>
                            <div>
                              <ShelfBadge
                                shelfNumber={
                                  item.shelfDetail.libraryShelf.shelfNumber
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col">
                          <div className="rounded-md border border-primary/20 bg-white p-2 shadow-sm">
                            <div className="flex flex-col items-center justify-center">
                              <Barcode
                                value={item.libraryItemInstance.barcode}
                                width={2}
                                height={48}
                                fontSize={20}
                                fontOptions="bold"
                              />
                            </div>
                          </div>
                        </div>

                        <Button
                          disabled={isPending}
                          onClick={() =>
                            handleAssignItem(
                              item.libraryItemInstance.libraryItemInstanceId
                            )
                          }
                        >
                          {t("Select")}
                        </Button>
                      </div>
                    ))}
                  </div>
                ))}
            </>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default AssignItemDialog
