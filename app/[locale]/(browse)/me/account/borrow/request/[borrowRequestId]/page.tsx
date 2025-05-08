import Link from "next/link"
import { notFound } from "next/navigation"
import getBorrowRequestPatron from "@/queries/borrows/get-borrow-request-patron"
import { ArrowLeft, BookOpen, Calendar, Clock, FileText } from "lucide-react"

import { getTranslations } from "@/lib/get-translations"
import { ETransactionStatus } from "@/lib/types/enums"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import NoData from "@/components/ui/no-data"
import BorrowRequestStatusBadge from "@/components/badges/borrow-request-status-badge"
import TransactionStatusBadge from "@/components/badges/transaction-status-badge"

import BorrowBookPreview from "../../_components/borrow-book-preview"
import BorrowReserveItemPreview from "../../_components/borrow-reserve-item-preview"
import BorrowResourcePreview from "../../_components/borrow-resource-preview"
import PaymentButton from "./_components/payment-button"

type Props = {
  params: {
    borrowRequestId: string
  }
}

const BorrowRequestDetail = async ({ params }: Props) => {
  const t = await getTranslations("BookPage.borrow tracking")

  const borrowRequest = await getBorrowRequestPatron(+params.borrowRequestId)

  const transaction = borrowRequest?.borrowRequestResources[0]?.transaction
  const transactionStatus = transaction?.transactionStatus

  if (!borrowRequest) {
    notFound()
  }

  return (
    <div className="mx-auto">
      <section className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            asChild
            className="rounded-full shadow-sm hover:shadow"
          >
            <Link href="/me/account/borrow">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{t("digital borrow detail")}</h1>
        </div>
      </section>

      {/* Status overview card */}
      <Card className="mb-4 overflow-hidden border-none bg-gradient-to-r from-primary/10 to-primary/5 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-primary">
                {t("status")}
              </h2>

              <BorrowRequestStatusBadge status={borrowRequest.status} />
            </div>

            <div className="grid grid-cols-2 gap-4 md:flex md:items-center md:gap-6">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  {t("request date")}
                </span>
                <span className="flex items-center font-medium">
                  <Calendar className="mr-1.5 size-3.5 text-primary" />
                  {formatDate(borrowRequest.requestDate.toString())}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  {t("pickup expiration date")}
                </span>
                <span className="flex items-center font-medium">
                  <Clock className="mr-1.5 size-3.5 text-primary" />
                  {borrowRequest.expirationDate ? (
                    formatDate(borrowRequest.expirationDate.toString())
                  ) : (
                    <NoData />
                  )}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  {t("total items")}
                </span>
                <span className="flex items-center font-medium">
                  <BookOpen className="mr-1.5 size-3.5 text-primary" />
                  {borrowRequest.totalRequestItem}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Request Information Card */}
        <Card className="overflow-hidden shadow-sm transition-all lg:col-span-1">
          <CardHeader className="bg-muted/30 pb-3">
            <CardTitle className="flex items-center text-lg">
              <FileText className="mr-2 size-5 text-primary" />
              {t("request details")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {borrowRequest.description && (
                <div className="rounded-md bg-muted/20 p-3">
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                    {t("description")}
                  </h3>
                  <p className="text-sm">{borrowRequest.description}</p>
                </div>
              )}

              {borrowRequest.cancelledAt && (
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                    {t("cancelled at")}
                  </h3>
                  <p className="text-sm">
                    {formatDate(borrowRequest.cancelledAt.toString())}
                  </p>
                </div>
              )}

              {borrowRequest.cancellationReason && (
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                    {t("cancellation reason")}
                  </h3>
                  <p className="text-sm">{borrowRequest.cancellationReason}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                    {t("reminder sent")}
                  </h3>
                  <Badge
                    variant={
                      borrowRequest.isReminderSent ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {borrowRequest.isReminderSent ? t("yes") : t("no")}
                  </Badge>
                </div>

                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                    {t("pending resources")}
                  </h3>
                  <Badge
                    variant={
                      borrowRequest.isExistPendingResources
                        ? "danger"
                        : "default"
                    }
                    className="text-xs"
                  >
                    {borrowRequest.isExistPendingResources ? t("yes") : t("no")}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Library Items Card */}
        {borrowRequest.libraryItems &&
          borrowRequest.libraryItems.length > 0 && (
            <Card className="overflow-hidden shadow-sm transition-all lg:col-span-3">
              <CardHeader className="bg-muted/30 pb-3">
                <CardTitle className="flex items-center text-lg">
                  <BookOpen className="mr-2 size-5 text-primary" />
                  {t("library items")}
                </CardTitle>
                <CardDescription>
                  {t("library items information description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {borrowRequest.libraryItems.map((libraryItem) => (
                    <BorrowBookPreview
                      expandable={true}
                      showTrash={true}
                      libraryItem={libraryItem}
                      key={`/borrow/library-items/${libraryItem.libraryItemId}`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        {/* Reservation Queue Card */}
        {borrowRequest.reservationQueues &&
          borrowRequest.reservationQueues.length > 0 && (
            <Card className="overflow-hidden shadow-sm transition-all lg:col-span-3">
              <CardHeader className="bg-muted/30 pb-3">
                <CardTitle className="flex items-center text-lg">
                  <Clock className="mr-2 size-5 text-primary" />
                  {t("reservation queue")}
                </CardTitle>
                <CardDescription>
                  {t("reservation queue description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {borrowRequest.reservationQueues.map((queue) => (
                    <BorrowReserveItemPreview
                      reservationQueue={queue}
                      expandable={true}
                      libraryItem={queue.libraryItem}
                      key={`/borrow/reservation-queues/${queue.libraryItemId}`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        {/* Borrow Request Resources Card */}
        {borrowRequest.borrowRequestResources.length > 0 && (
          <Card className="overflow-hidden shadow-sm transition-all lg:col-span-3">
            <CardHeader className="flex w-full flex-row items-center justify-between bg-muted/30 pb-3">
              <div>
                <CardTitle className="flex items-center text-lg">
                  <FileText className="mr-2 size-5 text-primary" />
                  {t("borrow request resource")}
                </CardTitle>
                <CardDescription>
                  {t("borrow request resource description")}
                </CardDescription>
              </div>

              <div className="flex items-center gap-4">
                {transactionStatus === ETransactionStatus.CANCELLED ||
                transactionStatus === ETransactionStatus.PAID ? (
                  <TransactionStatusBadge status={transactionStatus} />
                ) : null}

                {(borrowRequest.isExistPendingResources ||
                  transactionStatus === ETransactionStatus.PENDING) &&
                  transactionStatus !== ETransactionStatus.CANCELLED && (
                    <PaymentButton
                      borrowRequestId={+params.borrowRequestId}
                      transaction={transaction}
                    />
                  )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {borrowRequest.borrowRequestResources.map((resource) => (
                  <BorrowResourcePreview
                    notCancelItem={
                      transactionStatus === ETransactionStatus.CANCELLED ||
                      transactionStatus === ETransactionStatus.PAID
                    }
                    resource={resource}
                    key={`/borrow/borrow-request-resources/${resource.resourceId}`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default BorrowRequestDetail
