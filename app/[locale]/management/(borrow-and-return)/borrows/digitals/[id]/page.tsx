import React from "react"
import { notFound } from "next/navigation"
import { auth } from "@/queries/auth"
import getBorrowDigital from "@/queries/borrows/get-borrow-digital"
import { format } from "date-fns"
import { Check, X } from "lucide-react"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { formatFileSize, formatPrice } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import BarcodeGenerator from "@/components/ui/barcode-generator"
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
import ParseHtml from "@/components/ui/parse-html"
import ResourceBookTypeBadge from "@/components/badges/book-resource-type-badge"
import CardStatusBadge from "@/components/badges/card-status-badge"
import IssuanceMethodBadge from "@/components/badges/issuance-method-badge"

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

  const title = `${digital?.librarycard?.fullName} - ${format(
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

        {digital.librarycard && (
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
                  <Copitor content={digital.librarycard.fullName} />
                  <p>{digital.librarycard.fullName}</p>
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                <h4 className="font-bold">{t("Avatar on card")}</h4>
                <div className="flex gap-2">
                  <Avatar className="size-8">
                    <AvatarImage src={digital.librarycard.avatar || ""} />
                    <AvatarFallback>
                      {digital.librarycard.fullName
                        .split(" ")
                        .map((i) => i[0].toUpperCase())
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              <div className="col-span-12 flex flex-col border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Card barcode")}</h4>
                <div className="flex items-center gap-2">
                  <BarcodeGenerator
                    value={digital.librarycard.barcode}
                    options={{
                      format: "CODE128",
                      displayValue: true,
                      fontSize: 12,
                      width: 1,
                      height: 18,
                    }}
                  />
                  <Copitor content={digital.librarycard.barcode} />
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                <h4 className="font-bold">{t("Status")}</h4>
                <div className="flex gap-2">
                  <CardStatusBadge status={digital.librarycard.status} />
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Issuance method")}</h4>
                <div className="flex items-center gap-2">
                  <IssuanceMethodBadge
                    status={digital.librarycard.issuanceMethod}
                  />
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                <h4 className="font-bold">{t("Allow borrow more")}</h4>
                <div className="flex gap-2">
                  {digital.librarycard.isAllowBorrowMore ? (
                    <Check className="size-6 text-success" />
                  ) : (
                    <X className="size-6 text-danger" />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Max item once time")}</h4>
                <div className="flex gap-2">
                  <p>{digital.librarycard.maxItemOnceTime}</p>
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                <h4 className="font-bold">{t("Allow borrow more reason")}</h4>
                <div className="flex items-center gap-2">
                  {digital.librarycard.allowBorrowMoreReason ? (
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
                              data={digital.librarycard.allowBorrowMoreReason}
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
                  {digital.librarycard.isReminderSent ? (
                    <Check className="size-6 text-success" />
                  ) : (
                    <X className="size-6 text-danger" />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                <h4 className="font-bold">{t("Extended")}</h4>
                <div className="flex gap-2">
                  {digital.librarycard.isExtended ? (
                    <Check className="size-6 text-success" />
                  ) : (
                    <X className="size-6 text-danger" />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Extension count")}</h4>
                <div className="flex gap-2">
                  <p>{digital.librarycard.extensionCount}</p>
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                <h4 className="font-bold">{t("Total missed pick up")}</h4>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    {digital.librarycard.totalMissedPickUp ?? <NoData />}
                  </div>
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Issue date")}</h4>
                <div className="flex items-center gap-2">
                  {digital.librarycard.issueDate ? (
                    <p>
                      {format(digital.librarycard.issueDate, "dd MMM yyyy", {
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
                  {digital.librarycard.expiryDate ? (
                    <p>
                      {format(digital.librarycard.expiryDate, "dd MMM yyyy", {
                        locale: formatLocale,
                      })}
                    </p>
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Suspension reason")}</h4>
                <div className="flex gap-2">
                  {digital.librarycard.suspensionReason ? (
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
                              data={digital.librarycard.suspensionReason}
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
                    {digital.librarycard.rejectReason ? (
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
                                data={digital.librarycard.rejectReason}
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
                  {digital.librarycard.isArchived ? (
                    <Check className="size-6 text-success" />
                  ) : (
                    <X className="size-6 text-danger" />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                <h4 className="font-bold">{t("Archive reason")}</h4>
                <div className="flex gap-2">
                  {digital.librarycard.archiveReason ? (
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
                              data={digital.librarycard.archiveReason}
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
                  {digital.librarycard.transactionCode ? (
                    digital.librarycard.transactionCode
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                <h4 className="font-bold">{t("Suspension end date")}</h4>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    {digital.librarycard.suspensionEndDate ? (
                      <p>
                        {format(
                          digital.librarycard.suspensionEndDate,
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
      </div>
    </div>
  )
}

export default BorrowDigitalDetailPage
