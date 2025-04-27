import Image from "next/image"
import { notFound } from "next/navigation"
import { Link } from "@/i18n/routing"
import getBorrowReservationPatron from "@/queries/borrows/get-reservation-patron"
import { format } from "date-fns"
import { ArrowLeft, ArrowRight, BookOpen, Check, X } from "lucide-react"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import BarcodeGenerator from "@/components/ui/barcode-generator"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import ReservationStatusBadge from "@/components/badges/reservation-status-badge"

import BorrowBookPreview from "../../borrow/_components/borrow-book-preview"

type Props = {
  params: { reservationId: string }
}

const MeReservationDetail = async ({ params }: Props) => {
  const id = Number(params.reservationId)
  if (!id) notFound()

  const reservation = await getBorrowReservationPatron(id)

  if (!reservation) notFound()

  const formatLocale = await getFormatLocale()

  const t = await getTranslations("BorrowAndReturnManagementPage")
  const tBorrow = await getTranslations("BookPage.borrow tracking")

  return (
    <div className="mx-auto">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/me/account/reservation">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{tBorrow("reservation detail")}</h1>
      </div>

      <section className="flex flex-col gap-4 rounded-md border py-5">
        <div className="flex items-center justify-between gap-4 px-5">
          <h3 className="text-lg font-semibold">
            {t("Reservation information")}
          </h3>
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
            <h4 className="font-bold">{t("Reserved after request failed")}</h4>
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
      </section>

      <Card className="overflow-hidden shadow-sm transition-all lg:col-span-3">
        <CardHeader className="bg-muted/30 pb-3">
          <CardTitle className="flex items-center text-lg">
            <BookOpen className="mr-2 size-5 text-primary" />
            {tBorrow("library items")}
          </CardTitle>
          <CardDescription>
            {tBorrow("library items information description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <BorrowBookPreview
            expandable={true}
            libraryItem={reservation.libraryItem}
          />
        </CardContent>
      </Card>
    </div>
  )
}

export default MeReservationDetail
