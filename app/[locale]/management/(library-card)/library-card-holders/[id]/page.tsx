import React from "react"
import { notFound } from "next/navigation"
import { auth } from "@/queries/auth"
import checkCanExtendCard from "@/queries/patrons/cards/check-can-extend-card"
import getPatron from "@/queries/patrons/get-patron"
import { format } from "date-fns"
import { Check, X } from "lucide-react"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature, EPatronStatus } from "@/lib/types/enums"
import { getFullName } from "@/lib/utils"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CardStatusBadge from "@/components/badges/card-status-badge"
import GenderBadge from "@/components/badges/gender-badge"
import IssuanceMethodBadge from "@/components/badges/issuance-method-badge"
import PatronHasCardBadge from "@/components/badges/patron-has-card-badge"
import PatronStatusBadge from "@/components/badges/patron-status-badge"
import PatronTypeBadge from "@/components/badges/patron-type-badge"

import BorrowRequestsTab from "./_components/borrow-requests-tab"
import LibraryCardActionsDropdown from "./_components/card-actions-dropdown"
import PatronActionsDropdown from "./_components/patron-actions-dropdown"
import PatronDetailBreadCrumb from "./_components/patron-detail-bread-crumb"
import TransactionsTab from "./_components/transactions-tab"

type Props = {
  params: {
    id: string
  }
}

async function PatronDetailPage({ params }: Props) {
  await auth().protect(EFeature.LIBRARY_ITEM_MANAGEMENT)
  const t = await getTranslations("LibraryCardManagementPage")

  const formatLocale = await getFormatLocale()

  const patron = await getPatron(params.id)

  if (!patron) notFound()

  const canExtendCard = patron.libraryCard
    ? await checkCanExtendCard(patron.libraryCard?.libraryCardId)
    : false

  const fullName = getFullName(patron.firstName, patron.lastName)

  return (
    <div className="pb-8">
      <div className="flex flex-col gap-4">
        <PatronDetailBreadCrumb title={fullName} />

        <div className="flex flex-col gap-2">
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={patron.avatar || ""} />
                <AvatarFallback>
                  {fullName
                    .split(" ")
                    .map((i) => i[0].toUpperCase())
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-2xl font-semibold">{fullName}</h3>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-md border py-5">
          <div className="flex items-center justify-between gap-4 px-5">
            <h3 className="text-lg font-semibold">{t("Patron information")}</h3>
            <PatronActionsDropdown patron={patron} />
          </div>
          <div className="grid grid-cols-12 gap-y-6 text-sm">
            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Patron name")}</h4>
              <div className="flex items-center gap-2">
                <Copitor content={fullName} />

                <p>{fullName}</p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Email")}</h4>
              <div className="flex gap-2">
                <Copitor content={patron.email} />
                <p>{patron.email}</p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Phone")}</h4>
              <div className="flex gap-2">
                <Copitor content={patron.phone} />
                <p>{patron.phone}</p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Address")}</h4>
              <div className="flex gap-2">
                {patron.address ? <p>{patron.address}</p> : <NoData />}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Dob")}</h4>
              <div className="flex items-center gap-2">
                {patron.dob ? (
                  <p>
                    {format(patron.dob, "dd MMM yyyy", {
                      locale: formatLocale,
                    })}
                  </p>
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Gender")}</h4>
              <div className="flex gap-2">
                {patron.gender ? (
                  <GenderBadge gender={patron.gender} />
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Status")}</h4>
              <div className="flex gap-2">
                <PatronStatusBadge
                  status={
                    patron.isDeleted
                      ? EPatronStatus.DELETED
                      : patron.isActive
                        ? EPatronStatus.ACTIVE
                        : EPatronStatus.INACTIVE
                  }
                />
                <PatronHasCardBadge hasCard={!!patron.libraryCardId} />
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Type")}</h4>
              <div className="flex items-center gap-2">
                <PatronTypeBadge isEmployeeCreated={patron.isEmployeeCreated} />
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Created date")}</h4>
              <div className="flex items-center gap-2">
                {patron.createDate ? (
                  <p>
                    {format(patron.createDate, "dd MMM yyyy", {
                      locale: formatLocale,
                    })}
                  </p>
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Modified date")}</h4>
              <div className="flex gap-2">
                {patron.modifiedDate ? (
                  <p>
                    {format(patron.modifiedDate, "dd MMM yyyy", {
                      locale: formatLocale,
                    })}
                  </p>
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Modified by")}</h4>
              <div className="flex items-center gap-2">
                {patron.modifiedBy ? <p>{patron.modifiedBy}</p> : <NoData />}
              </div>
            </div>
          </div>
        </div>

        {patron.libraryCard && (
          <div className="flex flex-col gap-4 rounded-md border py-5">
            <div className="flex items-center justify-between gap-4 px-5">
              <h3 className="text-lg font-semibold">{t("Card information")}</h3>
              <LibraryCardActionsDropdown
                libraryCard={patron.libraryCard}
                userId={patron.userId}
                canExtendCard={canExtendCard}
              />
            </div>
            <div className="grid grid-cols-12 gap-y-6 text-sm">
              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Name on card")}</h4>
                <div className="flex items-center gap-2">
                  <Copitor content={patron.libraryCard?.fullName} />
                  <p>{patron.libraryCard?.fullName}</p>
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                <h4 className="font-bold">{t("Avatar on card")}</h4>
                <div className="flex gap-2">
                  <Avatar className="size-8">
                    <AvatarImage src={patron.libraryCard?.avatar || ""} />
                    <AvatarFallback>
                      {patron.libraryCard?.fullName
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
                    value={patron.libraryCard?.barcode}
                    options={{
                      format: "CODE128",
                      displayValue: true,
                      fontSize: 12,
                      width: 1,
                      height: 18,
                    }}
                  />
                  <Copitor content={patron.libraryCard?.barcode} />
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                <h4 className="font-bold">{t("Status")}</h4>
                <div className="flex gap-2">
                  <CardStatusBadge status={patron.libraryCard?.status} />
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Issuance method")}</h4>
                <div className="flex items-center gap-2">
                  <IssuanceMethodBadge
                    status={patron.libraryCard?.issuanceMethod}
                  />
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                <h4 className="font-bold">{t("Allow borrow more")}</h4>
                <div className="flex gap-2">
                  {patron.libraryCard?.isAllowBorrowMore ? (
                    <Check className="size-6 text-success" />
                  ) : (
                    <X className="size-6 text-danger" />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Max item once time")}</h4>
                <div className="flex gap-2">
                  <p>{patron.libraryCard?.maxItemOnceTime}</p>
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                <h4 className="font-bold">{t("Allow borrow more reason")}</h4>
                <div className="flex items-center gap-2">
                  {patron.libraryCard?.allowBorrowMoreReason ? (
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
                              data={patron.libraryCard?.allowBorrowMoreReason}
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
                  {patron.libraryCard?.isReminderSent ? (
                    <Check className="size-6 text-success" />
                  ) : (
                    <X className="size-6 text-danger" />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                <h4 className="font-bold">{t("Extended")}</h4>
                <div className="flex gap-2">
                  {patron.libraryCard?.isExtended ? (
                    <Check className="size-6 text-success" />
                  ) : (
                    <X className="size-6 text-danger" />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Extension count")}</h4>
                <div className="flex gap-2">
                  <p>{patron.libraryCard?.extensionCount}</p>
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                <h4 className="font-bold">{t("Total missed pick up")}</h4>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    {patron.libraryCard?.totalMissedPickUp ?? <NoData />}
                  </div>
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Issue date")}</h4>
                <div className="flex items-center gap-2">
                  {patron.libraryCard?.issueDate ? (
                    <p>
                      {format(patron.libraryCard?.issueDate, "dd MMM yyyy", {
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
                  {patron.libraryCard?.expiryDate ? (
                    <p>
                      {format(patron.libraryCard?.expiryDate, "dd MMM yyyy", {
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
                  {patron.libraryCard?.suspensionReason ? (
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
                              data={patron.libraryCard?.suspensionReason}
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
                    {patron.libraryCard?.rejectReason ? (
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
                                data={patron.libraryCard?.rejectReason}
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
                  {patron.libraryCard?.isArchived ? (
                    <Check className="size-6 text-success" />
                  ) : (
                    <X className="size-6 text-danger" />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                <h4 className="font-bold">{t("Archive reason")}</h4>
                <div className="flex gap-2">
                  {patron.libraryCard?.archiveReason ? (
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
                              data={patron.libraryCard?.archiveReason}
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
                  {patron.libraryCard?.transactionCode ? (
                    patron.libraryCard?.transactionCode
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                <h4 className="font-bold">{t("Suspension end date")}</h4>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    {patron.libraryCard?.suspensionEndDate ? (
                      <p>
                        {format(
                          patron.libraryCard?.suspensionEndDate,
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

        <Tabs defaultValue="borrow-records">
          <TabsList>
            <TabsTrigger value="borrow-records">
              {t("Borrow records")}
            </TabsTrigger>
            <TabsTrigger value="borrow-requests">
              {t("Borrow requests")}
            </TabsTrigger>
            <TabsTrigger value="digital-borrows">
              {t("Digital borrows")}
            </TabsTrigger>
            <TabsTrigger value="reservations">{t("Reservations")}</TabsTrigger>
            <TabsTrigger value="transactions">{t("Transactions")}</TabsTrigger>
            <TabsTrigger value="notifications">
              {t("Notifications")}
            </TabsTrigger>
          </TabsList>
          <BorrowRequestsTab userId={params.id} />
          <TransactionsTab userId={params.id} />
        </Tabs>
      </div>
    </div>
  )
}

export default PatronDetailPage
