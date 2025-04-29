import React from "react"
import { notFound } from "next/navigation"
import { auth } from "@/queries/auth"
import getCard from "@/queries/patrons/cards/get-card"
import { format } from "date-fns"
import { Check, X } from "lucide-react"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import BarcodeGenerator from "@/components/ui/barcode-generator"
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

import LibraryCardActionsDropdown from "../../library-card-holders/[id]/_components/card-actions-dropdown"
import CardDetailBreadCrumb from "./_components/patron-detail-bread-crumb"

type Props = {
  params: {
    id: string
  }
}

async function CardDetailPage({ params }: Props) {
  await auth().protect(EFeature.LIBRARY_ITEM_MANAGEMENT)
  const t = await getTranslations("LibraryCardManagementPage")

  const formatLocale = await getFormatLocale()

  const card = await getCard(params.id)

  if (!card) notFound()

  // const canExtendCard = await checkCanExtendCard(params.id)

  return (
    <div className="pb-8">
      <div className="flex flex-col gap-4">
        <CardDetailBreadCrumb title={card.fullName} />

        <div className="flex flex-col gap-2">
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={card.avatar || ""} />
                <AvatarFallback>
                  {card.fullName
                    .split(" ")
                    .map((i) => i[0].toUpperCase())
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-2xl font-semibold">{card.fullName}</h3>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-md border py-5">
          <div className="flex items-center justify-between gap-4 px-5">
            <h3 className="text-lg font-semibold">{t("Card information")}</h3>
            <LibraryCardActionsDropdown
              libraryCard={card}
              canExtendCard={false}
              userId=""
              cardPage
            />
          </div>
          <div className="grid grid-cols-12 gap-y-6 text-sm">
            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Name on card")}</h4>
              <div className="flex items-center gap-2">
                <Copitor content={card.fullName} />
                <p>{card.fullName}</p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Avatar on card")}</h4>
              <div className="flex gap-2">
                <Avatar className="size-8">
                  <AvatarImage src={card.avatar || ""} />
                  <AvatarFallback>
                    {card.fullName
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
                  value={card.barcode}
                  options={{
                    format: "CODE128",
                    displayValue: true,
                    fontSize: 12,
                    width: 1,
                    height: 18,
                  }}
                />
                <Copitor content={card.barcode} />
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Status")}</h4>
              <div className="flex gap-2">
                <CardStatusBadge status={card.status} />
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Issuance method")}</h4>
              <div className="flex items-center gap-2">
                <IssuanceMethodBadge status={card.issuanceMethod} />
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Allow borrow more")}</h4>
              <div className="flex gap-2">
                {card.isAllowBorrowMore ? (
                  <Check className="size-6 text-success" />
                ) : (
                  <X className="size-6 text-danger" />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Max item once time")}</h4>
              <div className="flex gap-2">
                <p>{card.maxItemOnceTime}</p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Allow borrow more reason")}</h4>
              <div className="flex items-center gap-2">
                {card.allowBorrowMoreReason ? (
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
                          <ParseHtml data={card.allowBorrowMoreReason} />
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
                {card.isReminderSent ? (
                  <Check className="size-6 text-success" />
                ) : (
                  <X className="size-6 text-danger" />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Extended")}</h4>
              <div className="flex gap-2">
                {card.isExtended ? (
                  <Check className="size-6 text-success" />
                ) : (
                  <X className="size-6 text-danger" />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Extension count")}</h4>
              <div className="flex gap-2">
                <p>{card.extensionCount}</p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Total missed pick up")}</h4>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  {card.totalMissedPickUp ?? <NoData />}
                </div>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Issue date")}</h4>
              <div className="flex items-center gap-2">
                {card.issueDate ? (
                  <p>
                    {format(card.issueDate, "dd MMM yyyy", {
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
                {card.expiryDate ? (
                  <p>
                    {format(card.expiryDate, "dd MMM yyyy", {
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
                {card.suspensionReason ? (
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
                          <ParseHtml data={card.suspensionReason} />
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
                  {card.rejectReason ? (
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
                            <ParseHtml data={card.rejectReason} />
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
                {card.isArchived ? (
                  <Check className="size-6 text-success" />
                ) : (
                  <X className="size-6 text-danger" />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Archive reason")}</h4>
              <div className="flex gap-2">
                {card.archiveReason ? (
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
                          <ParseHtml data={card.archiveReason} />
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
                {card.transactionCode ? card.transactionCode : <NoData />}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Suspension end date")}</h4>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  {card.suspensionEndDate ? (
                    <p>
                      {format(card.suspensionEndDate, "dd MMM yyyy", {
                        locale: formatLocale,
                      })}
                    </p>
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardDetailPage
