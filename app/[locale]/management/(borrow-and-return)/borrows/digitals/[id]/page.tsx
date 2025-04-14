import React from "react"
import { notFound } from "next/navigation"
import { auth } from "@/queries/auth"
import getBorrowDigital from "@/queries/borrows/get-borrow-digital"
import { format } from "date-fns"
import { Check, X } from "lucide-react"
import QRCode from "react-qr-code"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { formatFileSize, formatPrice, getFullName } from "@/lib/utils"
import BorrowDigitalStatusBadge from "@/components/ui/borrow-digital-status-badge"
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
import TransactionMethodBadge from "@/components/badges/transaction-method-badge"
import TransactionStatusBadge from "@/components/badges/transaction-status-badge"
import TransactionTypeBadge from "@/components/badges/transaction-type-badge"

type Props = {
  params: { id: number }
}

async function BorrowDigitalDetailPage({ params }: Props) {
  await auth().protect(EFeature.BORROW_MANAGEMENT)

  const id = Number(params.id)
  if (!id) notFound()

  const digital = await getBorrowDigital(id)

  if (!digital) notFound()

  const formatLocale = await getFormatLocale()

  const transaction = digital.transactions[0]

  const title = `${getFullName(transaction.user.firstName, transaction.user.lastName)} - ${format(
    digital.registerDate,
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
              <BreadcrumbLink href="/management/borrows/digitals">
                {t("Borrow digitals")}
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
            <h3 className="text-lg font-semibold">{t("Borrow information")}</h3>
          </div>
          <div className="grid grid-cols-12 gap-y-6 text-sm">
            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Borrow date")}</h4>
              <div className="flex items-center gap-2">
                {digital.registerDate ? (
                  <p>
                    {format(digital.registerDate, "HH:mm dd MMM yyyy", {
                      locale: formatLocale,
                    })}
                  </p>
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Expiry date")}</h4>
              <div className="flex gap-2">
                {digital.registerDate ? (
                  <p>
                    {format(digital.registerDate, "HH:mm dd MMM yyyy", {
                      locale: formatLocale,
                    })}
                  </p>
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Extended")}</h4>
              <div className="flex gap-2">
                {digital.isExtended ? (
                  <Check className="text-success" />
                ) : (
                  <X className="text-danger" />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Extension count")}</h4>
              <div className="flex gap-2">
                {digital.extensionCount ?? <NoData />}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Status")}</h4>
              <div className="flex items-center gap-2">
                <BorrowDigitalStatusBadge status={digital.status} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-md border py-5">
          <div className="flex items-center justify-between gap-4 px-5">
            <h3 className="text-lg font-semibold">{t("Resource")}</h3>
          </div>
          <div className="grid grid-cols-12 gap-y-6 text-sm">
            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Resource item")}</h4>
              <div className="flex items-center gap-2">
                {digital.libraryResource.resourceTitle || <NoData />}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Resource type")}</h4>
              <div className="flex gap-2">
                <ResourceBookTypeBadge
                  status={digital.libraryResource.resourceType}
                />
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Size")}</h4>
              <div className="flex gap-2">
                {digital.libraryResource.resourceSize ? (
                  formatFileSize(digital.libraryResource.resourceSize)
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Borrow duration")}</h4>
              <div className="flex gap-2">
                {digital.libraryResource.defaultBorrowDurationDays} {t("days")}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Borrow price")}</h4>
              <div className="flex items-center gap-2">
                {digital.libraryResource.borrowPrice ? (
                  formatPrice(digital.libraryResource.borrowPrice)
                ) : (
                  <NoData />
                )}
              </div>
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
                <TransactionMethodBadge
                  method={transaction.transactionMethod}
                />
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
      </div>
    </div>
  )
}

export default BorrowDigitalDetailPage
