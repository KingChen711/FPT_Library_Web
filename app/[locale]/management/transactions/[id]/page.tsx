import React from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { auth } from "@/queries/auth"
import getTransaction from "@/queries/transactions/get-transaction"
import { format } from "date-fns"
import QRCode from "react-qr-code"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { formatFileSize, formatPrice, getFullName } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import ResourceBookTypeBadge from "@/components/badges/book-resource-type-badge"
import FineTypeBadge from "@/components/badges/fine-type-badge"
import GenderBadge from "@/components/badges/gender-badge"
import TransactionMethodBadge from "@/components/badges/transaction-method-badge"
import TransactionStatusBadge from "@/components/badges/transaction-status-badge"
import TransactionTypeBadge from "@/components/badges/transaction-type-badge"

type Props = {
  params: { id: number }
}

async function TransactionDetailPage({ params }: Props) {
  await auth().protect(EFeature.BORROW_MANAGEMENT)

  const id = Number(params.id)
  if (!id) notFound()

  const transaction = await getTransaction(id)

  if (!transaction) notFound()

  const formatLocale = await getFormatLocale()

  const title = transaction.transactionCode

  const t = await getTranslations("TransactionsManagementPage")

  return (
    <div className="pb-8">
      <div className="flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/management/transactions">
                {t("Transactions")}
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
            <h3 className="text-lg font-semibold">{t("Transaction")}</h3>
          </div>
          <div className="grid grid-cols-12 gap-y-6 text-sm">
            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Transaction code")}</h4>
              <div className="flex items-center gap-2">
                <Copitor content={transaction.transactionCode} />
                {transaction.transactionCode || <NoData />}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Amount")}</h4>
              <div className="flex gap-2">
                {transaction.amount ? (
                  formatPrice(transaction.amount)
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Status")}</h4>
              <div className="flex gap-2">
                <TransactionStatusBadge
                  status={transaction.transactionStatus}
                />
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Type")}</h4>
              <div className="flex gap-2">
                <TransactionTypeBadge type={transaction.transactionType} />
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Transaction date")}</h4>
              <div className="flex items-center gap-2">
                {transaction.transactionDate ? (
                  format(transaction.transactionDate, "HH:mm dd MMM yyyy", {
                    locale: formatLocale,
                  })
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Expired at")}</h4>
              <div className="flex gap-2">
                {transaction.expiredAt ? (
                  format(transaction.expiredAt, "HH:mm dd MMM yyyy", {
                    locale: formatLocale,
                  })
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Created at")}</h4>
              <div className="flex gap-2">
                {transaction.createdAt ? (
                  format(transaction.createdAt, "HH:mm dd MMM yyyy", {
                    locale: formatLocale,
                  })
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Create by")}</h4>
              <div className="flex gap-2">
                {transaction.createdBy || <NoData />}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Cancelled at")}</h4>
              <div className="flex items-center gap-2">
                {transaction.cancelledAt ? (
                  format(transaction.cancelledAt, "HH:mm dd MMM yyyy", {
                    locale: formatLocale,
                  })
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Cancellation reason")}</h4>
              <div className="flex gap-2">
                {transaction.cancellationReason || <NoData />}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Method")}</h4>
              <div className="flex gap-2">
                {transaction.transactionMethod === null ||
                transaction.transactionMethod === undefined ? (
                  <NoData />
                ) : (
                  <TransactionMethodBadge
                    method={transaction.transactionMethod}
                  />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Payment QR code")}</h4>
              <div className="flex gap-2">
                {transaction.qrCode ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        {t("View content")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[80vh] w-fit overflow-y-auto overflow-x-hidden">
                      <DialogHeader>
                        <DialogTitle>{t("Payment QR code")}</DialogTitle>
                        <DialogDescription asChild>
                          <QRCode
                            value={transaction.qrCode}
                            size={200}
                            style={{
                              height: "auto",
                              maxWidth: "100%",
                              width: "100%",
                            }}
                            viewBox={`0 0 256 256`}
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
        </div>

        <div className="flex flex-col gap-4 rounded-md border py-5">
          <div className="flex items-center justify-between gap-4 px-5">
            <h3 className="text-lg font-semibold">{t("Patron")}</h3>
          </div>
          <div className="grid grid-cols-12 gap-y-6 text-sm">
            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Full name")}</h4>
              <div className="flex items-center gap-2 py-1">
                <Link
                  target="_blank"
                  href={`/management/library-card-holders/${transaction.user.userId}`}
                  className="group flex items-center gap-2"
                >
                  {transaction.user.avatar && (
                    <Avatar className="size-8">
                      <AvatarImage src={transaction.user.avatar || ""} />
                      <AvatarFallback>
                        {getFullName(
                          transaction.user.firstName,
                          transaction.user.lastName
                        )
                          .split(" ")
                          .map((i) => i[0].toUpperCase())
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="group-hover:underline">
                    {getFullName(
                      transaction.user.firstName,
                      transaction.user.lastName
                    )}
                  </div>
                </Link>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Email")}</h4>
              <div className="flex gap-2">
                {transaction.user.email || <NoData />}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Phone")}</h4>
              <div className="flex gap-2">
                {transaction.user.phone || <NoData />}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Gender")}</h4>
              <div className="flex gap-2">
                <GenderBadge gender={transaction.user.gender} />
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Date of birth")}</h4>
              <div className="flex gap-2">
                {transaction.user.dob ? (
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  format(transaction.user.dob, "dd MMM yyyy", {
                    locale: formatLocale,
                  })
                ) : (
                  <NoData />
                )}
              </div>
            </div>
          </div>
        </div>

        {transaction.libraryCardPackage && (
          <div className="flex flex-col gap-4 rounded-md border py-5">
            <div className="flex items-center justify-between gap-4 px-5">
              <h3 className="text-lg font-semibold">
                {t("Registered package")}
              </h3>
            </div>
            <div className="grid grid-cols-12 gap-y-6 text-sm">
              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Name")}</h4>
                <div className="flex items-center gap-2 py-1">
                  {transaction.libraryCardPackage.packageName}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                <h4 className="font-bold">{t("Price")}</h4>
                <div className="flex gap-2">
                  {transaction.libraryCardPackage.price ? (
                    formatPrice(transaction.libraryCardPackage.price)
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Duration")}</h4>
                <div className="flex gap-2">
                  {transaction.libraryCardPackage.durationInMonths ? (
                    t("duration months", {
                      months: transaction.libraryCardPackage.durationInMonths,
                    })
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                <h4 className="font-bold">{t("Description")}</h4>
                <div className="flex gap-2">
                  {transaction.libraryCardPackage.description}
                </div>
              </div>
            </div>
          </div>
        )}

        {transaction.libraryResource && (
          <div className="flex flex-col gap-4 rounded-md border py-5">
            <div className="flex items-center justify-between gap-4 px-5">
              <h3 className="text-lg font-semibold">{t("Resource")}</h3>
            </div>
            <div className="grid grid-cols-12 gap-y-6 text-sm">
              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Resource item")}</h4>
                <div className="flex items-center gap-2">
                  {transaction.libraryResource.resourceTitle || <NoData />}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                <h4 className="font-bold">{t("Resource type")}</h4>
                <div className="flex gap-2">
                  <ResourceBookTypeBadge
                    status={transaction.libraryResource.resourceType}
                  />
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Size")}</h4>
                <div className="flex gap-2">
                  {transaction.libraryResource.resourceSize ? (
                    formatFileSize(transaction.libraryResource.resourceSize)
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                <h4 className="font-bold">{t("Borrow duration")}</h4>
                <div className="flex gap-2">
                  {transaction.libraryResource.defaultBorrowDurationDays}{" "}
                  {t("days")}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                <h4 className="font-bold">{t("Borrow price")}</h4>
                <div className="flex items-center gap-2">
                  {transaction.libraryResource.borrowPrice ? (
                    formatPrice(transaction.libraryResource.borrowPrice)
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {transaction.fine && (
          <div className="flex flex-col gap-4 rounded-md border py-5">
            <div className="flex items-center justify-between gap-4 px-5">
              <h3 className="text-lg font-semibold">{t("Fine")}</h3>
            </div>
            <div className="grid grid-cols-12 gap-y-6 text-sm">
              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Name")}</h4>
                <div className="flex items-center gap-2">
                  {transaction.fine.finePolicy.finePolicyTitle || <NoData />}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                <h4 className="font-bold">{t("Description")}</h4>
                <div className="flex gap-2">
                  {transaction.fine.finePolicy.description || <NoData />}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Note")}</h4>
                <div className="flex gap-2">
                  {transaction.fine.fineNote || <NoData />}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                <h4 className="font-bold">{t("Type")}</h4>
                <div className="flex gap-2">
                  <FineTypeBadge
                    type={transaction.fine.finePolicy.conditionType}
                  />
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                <h4 className="font-bold">{t("Price")}</h4>
                <div className="flex items-center gap-2">
                  {transaction.fine.fineAmount ? (
                    formatPrice(transaction.fine.fineAmount)
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TransactionDetailPage
