"use client"

import { useState, useTransition } from "react"
import { Link, useRouter } from "@/i18n/routing"
import { type ReservationQueues } from "@/queries/reservations/check-assignable"
import { format } from "date-fns"
import { ArrowRight, Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import Barcode from "react-barcode"

import handleServerActionError from "@/lib/handle-server-action-error"
import { applyLabel } from "@/actions/borrow-records/apply-label"
import useAssignItems, {
  type AssignedReservations,
} from "@/hooks/borrow/use-assign-items"
import { toast } from "@/hooks/use-toast"
import useFormatLocale from "@/hooks/utils/use-format-locale"
import BarcodeGenerator from "@/components/ui/barcode-generator"
import LibraryItemCard from "@/components/ui/book-card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox" // Giả sử bạn đã có component Checkbox từ Shadcn UI

import { Label } from "@/components/ui/label"

import ConfirmApplyDialog from "./confirm-apply-dialog"

interface AssignReservationsFormProps {
  reservations: ReservationQueues
}

export default function AssignReservationsForm({
  reservations,
}: AssignReservationsFormProps) {
  const t = useTranslations("BorrowAndReturnManagementPage")
  const router = useRouter()
  const locale = useLocale()
  const formatLocale = useFormatLocale()

  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const { mutate: assignItems, isPending: assigningItems } = useAssignItems()
  const [transitioning, startTransition] = useTransition()

  const isPending = assigningItems || transitioning

  const [assignedReservations, setAssignedReservations] =
    useState<AssignedReservations>([])

  const [mode, setMode] = useState<"assign" | "label">("assign")

  const handleAssign = () => {
    assignItems(selectedIds, {
      onSuccess: (res) => {
        if (res.isSuccess) {
          toast({
            title: locale === "vi" ? "Thành công" : "Success",
            description: res.data.message,
            variant: "success",
          })

          setAssignedReservations(res.data.assignedReservation)
          setMode("label")
          return
        }

        handleServerActionError(res, locale)
      },
    })
  }

  const handelApplyLabel = () => {
    startTransition(async () => {
      const res = await applyLabel(
        assignedReservations.map((r) => r.reservationQueue.queueId)
      )

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })

        router.push(`/management/borrows/records`)

        return
      }

      handleServerActionError(res, locale)
    })
  }

  return (
    <div className="space-y-6">
      {reservations.map((reservation) => {
        const { libraryItem, libraryItemInstance } = reservation
        const latestCondition =
          locale === "vi"
            ? libraryItemInstance.libraryItemConditionHistories[0]?.condition
                ?.vietnameseName
            : libraryItemInstance.libraryItemConditionHistories[0]?.condition
                ?.englishName

        const assignedReservation = assignedReservations.find(
          (r) =>
            r.reservationQueue.libraryItemInstanceId ===
            libraryItemInstance.libraryItemInstanceId
        )

        const isShow = mode === "assign" || !!assignedReservation

        if (!isShow) return null

        return (
          <div
            key={reservation.queueId}
            className="w-full rounded-md border p-4"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-6">
                <LibraryItemCard
                  className="max-w-full"
                  libraryItem={libraryItem}
                />

                <div className="ml-auto flex w-[370px] shrink-0 items-center justify-between gap-6">
                  <div className="flex w-[106px] justify-center">
                    <div className="flex flex-col items-center">
                      <ArrowRight className="size-10 text-primary" />
                    </div>
                  </div>

                  <div className="rounded-md border border-primary/20 bg-white p-2 shadow-sm">
                    <div className="flex flex-col items-center justify-center">
                      <Barcode
                        value={libraryItemInstance.barcode}
                        width={2}
                        height={48}
                        fontSize={20}
                        fontOptions="bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Thông tin bản vật lý */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Label>{t("Condition")}:</Label>
                  <span>{latestCondition}</span>
                </div>
                {mode === "assign" ? (
                  <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                    <Checkbox
                      checked={selectedIds.includes(
                        libraryItemInstance.libraryItemInstanceId
                      )}
                      onCheckedChange={() => {
                        if (
                          selectedIds.includes(
                            libraryItemInstance.libraryItemInstanceId
                          )
                        ) {
                          setSelectedIds((prev) =>
                            prev.filter(
                              (id) =>
                                id !== libraryItemInstance.libraryItemInstanceId
                            )
                          )
                          return
                        }
                        setSelectedIds((prev) => [
                          ...prev,
                          libraryItemInstance.libraryItemInstanceId,
                        ])
                      }}
                    />

                    <div className="space-y-1 leading-none">
                      <Label>{t("Confirm assign")}</Label>
                      <div className="text-[0.8rem] text-muted-foreground">
                        {t("Confirm assign description")}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Label>{t("Reservation info")}</Label>
                    <div className="w-full max-w-md rounded-md border">
                      <div className="space-y-4 p-4">
                        <div className="rounded-md bg-warning p-3 text-center">
                          <p className="font-bold text-danger">
                            {t("Reservation code")}:{" "}
                            {assignedReservation?.reservationCode}
                          </p>
                        </div>

                        <div className="flex flex-wrap justify-between gap-4">
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              {t("Fullname")}:
                            </p>
                            <p className="font-medium">
                              {assignedReservation?.fullName}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              {t("Reservation date")}:
                            </p>
                            <p className="font-medium">
                              {format(
                                new Date(
                                  assignedReservation!.reservationQueue.reservationDate
                                ),
                                "dd MMM yyyy",
                                { locale: formatLocale }
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap justify-between gap-4">
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              {t("Assigned date")}:
                            </p>
                            <p className="font-medium">
                              {format(
                                new Date(assignedReservation!.assignedDate),
                                "dd MMM yyyy",
                                { locale: formatLocale }
                              )}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              {t("Expired date")}:
                            </p>
                            <p className="font-medium">
                              {format(
                                new Date(
                                  assignedReservation!.reservationQueue.expiryDate!
                                ),
                                "dd MMM yyyy",
                                { locale: formatLocale }
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            {t("Patron card code")}:
                          </p>
                          <div className="flex justify-center">
                            <BarcodeGenerator
                              value={assignedReservation!.cardBarcode}
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
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
      <div className="flex justify-end gap-4">
        <Button disabled={isPending} variant="outline">
          <Link href="/management/borrows/records">{t("Cancel")}</Link>
        </Button>
        {mode === "assign" ? (
          <Button disabled={isPending} onClick={handleAssign}>
            {t("Continue")}
            {isPending && <Loader2 className="ml-1 size-4 animate-spin" />}
          </Button>
        ) : (
          <ConfirmApplyDialog
            isPending={isPending}
            onApplyLabel={handelApplyLabel}
            amount={assignedReservations.length}
          />
        )}
      </div>
    </div>
  )
}
