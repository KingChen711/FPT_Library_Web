import React from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { auth } from "@/queries/auth"
import getReservation from "@/queries/borrows/get-reservation"
import { format } from "date-fns"
import { ArrowRight, Check, X } from "lucide-react"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import BarcodeGenerator from "@/components/ui/barcode-generator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import Copitor from "@/components/ui/copitor"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import NoData from "@/components/ui/no-data"
import ParseHtml from "@/components/ui/parse-html"
import CardStatusBadge from "@/components/badges/card-status-badge"
import IssuanceMethodBadge from "@/components/badges/issuance-method-badge"
import ReservationStatusBadge from "@/components/badges/reservation-status-badge"

import ReservationActionsDropdown from "./_components/reservation-actions-dropdown"

type Props = {
  params: { id: number }
}

async function BorrowReservationDetailPage({ params }: Props) {
  await auth().protect(EFeature.BORROW_MANAGEMENT)

  const id = Number(params.id)
  if (!id) notFound()

  const reservation = await getReservation(id)

  if (!reservation) notFound()

  const formatLocale = await getFormatLocale()

  const title = `${reservation.libraryCard.fullName} - ${format(
    reservation.reservationDate,
    "dd MMM yyyy",
    {
      locale: formatLocale,
    }
  )}`

  const t = await getTranslations("BorrowAndReturnManagementPage")

  return (
    <div className="pb-8">
      <div className="flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/management/borrows/reservations">
                {t("Borrow reservations")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-2">
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-semibold">{title}</h3>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-md border py-5">
          <div className="flex items-center justify-between gap-4 px-5">
            <h3 className="text-lg font-semibold">
              {t("Reservation information")}
            </h3>
            <ReservationActionsDropdown
              assignedDate={reservation.assignedDate}
              cardBarcode={reservation.libraryCard.barcode}
              expiryDate={reservation.expiryDate}
              fullName={reservation.libraryCard.fullName}
              reservationCode={reservation.reservationCode}
              reservationDate={reservation.reservationDate}
              isAppliedLabel={reservation.isAppliedLabel}
              canAssign={!reservation.libraryItemInstance}
              reservationId={reservation.queueId}
              status={reservation.queueStatus}
            />
          </div>
          <div className="grid grid-cols-12 gap-y-6 text-sm">
            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Reservation code")}</h4>
              <div className="flex items-center gap-2">
                <Copitor content={reservation.reservationCode} />
                {reservation.reservationCode || <NoData />}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Status")}</h4>
              <div className="flex items-center gap-2">
                <ReservationStatusBadge status={reservation.queueStatus} />
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Assignable")}</h4>
              <div className="flex gap-2">
                {reservation.isAssignable ? (
                  <Check className="text-success" />
                ) : (
                  <X className="text-danger" />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Applied label")}</h4>
              <div className="flex gap-2">
                {reservation.isAppliedLabel ? (
                  <Check className="text-success" />
                ) : (
                  <X className="text-danger" />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Reservation date")}</h4>
              <div className="flex items-center gap-2">
                {reservation.reservationDate ? (
                  format(new Date(reservation.reservationDate), "dd MMM yyyy", {
                    locale: formatLocale,
                  })
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Expected date")}</h4>
              <div className="flex items-center gap-2">
                {reservation.expectedAvailableDateMin ? (
                  format(
                    new Date(reservation.expectedAvailableDateMin),
                    "dd MMM yyyy",
                    {
                      locale: formatLocale,
                    }
                  )
                ) : (
                  <NoData />
                )}
                <ArrowRight className="size-3" />
                {reservation.expectedAvailableDateMax ? (
                  format(
                    new Date(reservation.expectedAvailableDateMax),
                    "dd MMM yyyy",
                    {
                      locale: formatLocale,
                    }
                  )
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Assigned date")}</h4>
              <div className="flex gap-2">
                {reservation.assignedDate ? (
                  format(new Date(reservation.assignedDate), "dd MMM yyyy", {
                    locale: formatLocale,
                  })
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Collected date")}</h4>
              <div className="flex gap-2">
                {reservation.collectedDate ? (
                  format(new Date(reservation.collectedDate), "dd MMM yyyy", {
                    locale: formatLocale,
                  })
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Expiry date")}</h4>
              <div className="flex items-center gap-2">
                {reservation.expiryDate ? (
                  format(new Date(reservation.expiryDate), "dd MMM yyyy", {
                    locale: formatLocale,
                  })
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Total extend pickup")}</h4>
              <div className="flex items-center gap-2">
                {reservation.totalExtendPickup}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Notified")}</h4>
              <div className="flex gap-2">
                {reservation.isNotified ? (
                  <Check className="text-success" />
                ) : (
                  <X className="text-danger" />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Cancelled by")}</h4>
              <div className="flex gap-2">
                {reservation.cancelledBy || <NoData />}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Cancellation reason")}</h4>
              <div className="flex items-center gap-2">
                {reservation.cancellationReason ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        {t("View content")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[80vh] overflow-y-auto overflow-x-hidden">
                      <DialogHeader>
                        <DialogTitle>{t("Cancellation reason")}</DialogTitle>
                        <DialogDescription>
                          <ParseHtml data={reservation.cancellationReason} />
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">
                {t("Reserved after request failed")}
              </h4>
              <div className="flex items-center gap-2">
                {reservation.isReservedAfterRequestFailed ? (
                  <Check className="text-success" />
                ) : (
                  <X className="text-danger" />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Reserved item")}</h4>
              <div className="flex items-center gap-2">
                <Link
                  target="_blank"
                  href={`/management/books/${reservation.libraryItem.libraryItemId}`}
                  className="group flex items-center gap-2 pr-8"
                >
                  {reservation.libraryItem.coverImage ? (
                    <Image
                      alt={reservation.libraryItem.title}
                      src={reservation.libraryItem.coverImage}
                      width={40}
                      height={60}
                      className="aspect-[2/3] h-12 w-8 rounded-sm border object-cover"
                    />
                  ) : (
                    <div className="h-12 w-8 rounded-sm border"></div>
                  )}
                  <p className="font-bold group-hover:underline">
                    {reservation.libraryItem.title}
                  </p>
                </Link>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Assigned barcode")}</h4>
              <div className="flex gap-2">
                {reservation.libraryItemInstance?.barcode ? (
                  <BarcodeGenerator
                    value={reservation.libraryItemInstance?.barcode}
                    options={{
                      containerHeight: 64,
                      containerWidth: 230,
                      format: "CODE128",
                      displayValue: true,
                      fontSize: 16,
                      width: 2,
                      height: 24,
                    }}
                  />
                ) : (
                  <NoData />
                )}
                <Copitor content={reservation.libraryItemInstance?.barcode} />
              </div>
            </div>
          </div>
        </div>

        {reservation.libraryCard && (
          <div className="flex flex-col gap-4 rounded-md border py-5">
            <div className="flex items-center justify-between gap-4 px-5">
              <h3 className="text-lg font-semibold">
                {t("Patron information")}
              </h3>
            </div>
            <div className="grid grid-cols-12 gap-y-6 text-sm">
              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Name on card")}</h4>
                <div className="flex items-center gap-2">
                  <Copitor content={reservation.libraryCard.fullName} />
                  <p>{reservation.libraryCard.fullName}</p>
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                <h4 className="font-bold">{t("Avatar on card")}</h4>
                <div className="flex gap-2">
                  <Avatar className="size-8">
                    <AvatarImage src={reservation.libraryCard.avatar || ""} />
                    <AvatarFallback>
                      {reservation.libraryCard.fullName
                        .split(" ")
                        .map((i) => i[0].toUpperCase())
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              <div className="col-span-12 flex flex-col border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Barcode")}</h4>
                <div className="flex items-center gap-2">
                  <BarcodeGenerator
                    value={reservation.libraryCard.barcode}
                    options={{
                      format: "CODE128",
                      displayValue: true,
                      fontSize: 12,
                      width: 1,
                      height: 18,
                    }}
                  />
                  <Copitor content={reservation.libraryCard.barcode} />
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                <h4 className="font-bold">{t("Status")}</h4>
                <div className="flex gap-2">
                  <CardStatusBadge status={reservation.libraryCard.status} />
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Issuance method")}</h4>
                <div className="flex items-center gap-2">
                  <IssuanceMethodBadge
                    status={reservation.libraryCard.issuanceMethod}
                  />
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                <h4 className="font-bold">{t("Allow borrow more")}</h4>
                <div className="flex gap-2">
                  {reservation.libraryCard.isAllowBorrowMore ? (
                    <Check className="size-6 text-success" />
                  ) : (
                    <X className="size-6 text-danger" />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Max item once time")}</h4>
                <div className="flex gap-2">
                  <p>{reservation.libraryCard.maxItemOnceTime}</p>
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                <h4 className="font-bold">{t("Allow borrow more reason")}</h4>
                <div className="flex items-center gap-2">
                  {reservation.libraryCard.allowBorrowMoreReason ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          {t("View content")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[80vh] overflow-y-auto overflow-x-hidden">
                        <DialogHeader>
                          <DialogTitle>
                            {t("Allow borrow more reason")}
                          </DialogTitle>
                          <DialogDescription>
                            <ParseHtml
                              data={
                                reservation.libraryCard.allowBorrowMoreReason
                              }
                            />
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Reminder sent")}</h4>
                <div className="flex items-center gap-2">
                  {reservation.libraryCard.isReminderSent ? (
                    <Check className="size-6 text-success" />
                  ) : (
                    <X className="size-6 text-danger" />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                <h4 className="font-bold">{t("Extended")}</h4>
                <div className="flex gap-2">
                  {reservation.libraryCard.isExtended ? (
                    <Check className="size-6 text-success" />
                  ) : (
                    <X className="size-6 text-danger" />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Extension count")}</h4>
                <div className="flex gap-2">
                  <p>{reservation.libraryCard.extensionCount}</p>
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                <h4 className="font-bold">{t("Total missed pick up")}</h4>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    {reservation.libraryCard.totalMissedPickUp ?? <NoData />}
                  </div>
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Issue date")}</h4>
                <div className="flex items-center gap-2">
                  {reservation.libraryCard.issueDate ? (
                    <p>
                      {format(
                        reservation.libraryCard.issueDate,
                        "dd MMM yyyy",
                        {
                          locale: formatLocale,
                        }
                      )}
                    </p>
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                <h4 className="font-bold">{t("Expiry date")}</h4>
                <div className="flex gap-2">
                  {reservation.libraryCard.expiryDate ? (
                    <p>
                      {format(
                        reservation.libraryCard.expiryDate,
                        "dd MMM yyyy",
                        {
                          locale: formatLocale,
                        }
                      )}
                    </p>
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Suspension reason")}</h4>
                <div className="flex gap-2">
                  {reservation.libraryCard.suspensionReason ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          {t("View content")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[80vh] overflow-y-auto overflow-x-hidden">
                        <DialogHeader>
                          <DialogTitle>
                            {t("Allow borrow more reason")}
                          </DialogTitle>
                          <DialogDescription>
                            <ParseHtml
                              data={reservation.libraryCard.suspensionReason}
                            />
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                <h4 className="font-bold">{t("Reject reason")}</h4>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    {reservation.libraryCard.rejectReason ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            {t("View content")}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[80vh] overflow-y-auto overflow-x-hidden">
                          <DialogHeader>
                            <DialogTitle>
                              {t("Allow borrow more reason")}
                            </DialogTitle>
                            <DialogDescription>
                              <ParseHtml
                                data={reservation.libraryCard.rejectReason}
                              />
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <NoData />
                    )}
                  </div>
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Archived")}</h4>
                <div className="flex items-center gap-2">
                  {reservation.libraryCard.isArchived ? (
                    <Check className="size-6 text-success" />
                  ) : (
                    <X className="size-6 text-danger" />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                <h4 className="font-bold">{t("Archive reason")}</h4>
                <div className="flex gap-2">
                  {reservation.libraryCard.archiveReason ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          {t("View content")}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[80vh] overflow-y-auto overflow-x-hidden">
                        <DialogHeader>
                          <DialogTitle>
                            {t("Allow borrow more reason")}
                          </DialogTitle>
                          <DialogDescription>
                            <ParseHtml
                              data={reservation.libraryCard.archiveReason}
                            />
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Transaction code")}</h4>
                <div className="flex gap-2">
                  {reservation.libraryCard.transactionCode ? (
                    reservation.libraryCard.transactionCode
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                <h4 className="font-bold">{t("Suspension end date")}</h4>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    {reservation.libraryCard.suspensionEndDate ? (
                      <p>
                        {format(
                          reservation.libraryCard.suspensionEndDate,
                          "dd MMM yyyy",
                          {
                            locale: formatLocale,
                          }
                        )}
                      </p>
                    ) : (
                      <NoData />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BorrowReservationDetailPage
