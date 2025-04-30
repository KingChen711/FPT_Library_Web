import React from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { auth } from "@/queries/auth"
import getBorrowRequest from "@/queries/borrows/get-borrow-request"
import { format } from "date-fns"
import { Check, X } from "lucide-react"

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import BorrowRequestStatusBadge from "@/components/badges/borrow-request-status-badge"
import CardStatusBadge from "@/components/badges/card-status-badge"
import IssuanceMethodBadge from "@/components/badges/issuance-method-badge"
import ShelfBadge from "@/components/badges/shelf-badge"

import ItemActionsDropdown from "./_components/item-actions-dropdown"

type Props = {
  params: { id: number }
}

async function BorrowRequestDetailPage({ params }: Props) {
  await auth().protect(EFeature.BORROW_MANAGEMENT)

  const id = Number(params.id)
  if (!id) notFound()

  const request = await getBorrowRequest(id)

  if (!request) notFound()

  const formatLocale = await getFormatLocale()

  const title = `${request.libraryCard.fullName} - ${format(
    request.requestDate,
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
              <BreadcrumbLink href="/management/borrows/requests">
                {t("Borrow requests")}
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
              {t("Request information")}
            </h3>
          </div>
          <div className="grid grid-cols-12 gap-y-6 text-sm">
            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Request date")}</h4>
              <div className="flex items-center gap-2">
                {request.requestDate ? (
                  <p>
                    {format(request.requestDate, "dd MMM yyyy", {
                      locale: formatLocale,
                    })}
                  </p>
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Request date")}</h4>
              <div className="flex items-center gap-2">
                {request.expirationDate ? (
                  <p>
                    {format(request.expirationDate, "dd MMM yyyy", {
                      locale: formatLocale,
                    })}
                  </p>
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Total request items")}</h4>
              <div className="flex gap-2">{request.totalRequestItem}</div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Status")}</h4>
              <div className="flex gap-2">
                <BorrowRequestStatusBadge status={request.status} />
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Reminder sent")}</h4>
              <div className="flex items-center gap-2">
                {request.isReminderSent ? (
                  <Check className="text-success" />
                ) : (
                  <X className="text-danger" />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Description")}</h4>
              <div className="flex items-center gap-2">
                {request.description ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        {t("View content")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[80vh] overflow-y-auto overflow-x-hidden">
                      <DialogHeader>
                        <DialogTitle>{t("Description")}</DialogTitle>
                        <DialogDescription>
                          <ParseHtml data={request.description} />
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
              <h4 className="font-bold">{t("Cancelled at")}</h4>
              <div className="flex gap-2">
                {request.cancelledAt ? (
                  format(new Date(request.cancelledAt), "HH:mm dd MMM yyyy", {
                    locale: formatLocale,
                  })
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Cancellation reason")}</h4>
              <div className="flex gap-2">
                {request.cancellationReason ? (
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
                          <ParseHtml data={request.cancellationReason} />
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

        {request.libraryCard && (
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
                  <Copitor content={request.libraryCard.fullName} />
                  <p>{request.libraryCard.fullName}</p>
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                <h4 className="font-bold">{t("Avatar on card")}</h4>
                <div className="flex gap-2">
                  <Avatar className="size-8">
                    <AvatarImage src={request.libraryCard.avatar || ""} />
                    <AvatarFallback>
                      {request.libraryCard.fullName
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
                    value={request.libraryCard.barcode}
                    options={{
                      format: "CODE128",
                      displayValue: true,
                      fontSize: 12,
                      width: 1,
                      height: 18,
                    }}
                  />
                  <Copitor content={request.libraryCard.barcode} />
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                <h4 className="font-bold">{t("Status")}</h4>
                <div className="flex gap-2">
                  <CardStatusBadge status={request.libraryCard.status} />
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Issuance method")}</h4>
                <div className="flex items-center gap-2">
                  <IssuanceMethodBadge
                    status={request.libraryCard.issuanceMethod}
                  />
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                <h4 className="font-bold">{t("Allow borrow more")}</h4>
                <div className="flex gap-2">
                  {request.libraryCard.isAllowBorrowMore ? (
                    <Check className="size-6 text-success" />
                  ) : (
                    <X className="size-6 text-danger" />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Max item once time")}</h4>
                <div className="flex gap-2">
                  <p>{request.libraryCard.maxItemOnceTime}</p>
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                <h4 className="font-bold">{t("Allow borrow more reason")}</h4>
                <div className="flex items-center gap-2">
                  {request.libraryCard.allowBorrowMoreReason ? (
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
                              data={request.libraryCard.allowBorrowMoreReason}
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
                  {request.libraryCard.isReminderSent ? (
                    <Check className="size-6 text-success" />
                  ) : (
                    <X className="size-6 text-danger" />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                <h4 className="font-bold">{t("Extended")}</h4>
                <div className="flex gap-2">
                  {request.libraryCard.isExtended ? (
                    <Check className="size-6 text-success" />
                  ) : (
                    <X className="size-6 text-danger" />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Extension count")}</h4>
                <div className="flex gap-2">
                  <p>{request.libraryCard.extensionCount}</p>
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                <h4 className="font-bold">{t("Total missed pick up")}</h4>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    {request.libraryCard.totalMissedPickUp ?? <NoData />}
                  </div>
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Issue date")}</h4>
                <div className="flex items-center gap-2">
                  {request.libraryCard.issueDate ? (
                    <p>
                      {format(request.libraryCard.issueDate, "dd MMM yyyy", {
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
                  {request.libraryCard.expiryDate ? (
                    <p>
                      {format(request.libraryCard.expiryDate, "dd MMM yyyy", {
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
                  {request.libraryCard.suspensionReason ? (
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
                              data={request.libraryCard.suspensionReason}
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
                    {request.libraryCard.rejectReason ? (
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
                                data={request.libraryCard.rejectReason}
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
                  {request.libraryCard.isArchived ? (
                    <Check className="size-6 text-success" />
                  ) : (
                    <X className="size-6 text-danger" />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                <h4 className="font-bold">{t("Archive reason")}</h4>
                <div className="flex gap-2">
                  {request.libraryCard.archiveReason ? (
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
                              data={request.libraryCard.archiveReason}
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
                  {request.libraryCard.transactionCode ? (
                    request.libraryCard.transactionCode
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                <h4 className="font-bold">{t("Suspension end date")}</h4>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    {request.libraryCard.suspensionEndDate ? (
                      <p>
                        {format(
                          request.libraryCard.suspensionEndDate,
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

        <div className="flex flex-col gap-3">
          <h3 className="text-xl font-semibold">{t("Request items")}</h3>

          <div className="grid w-full">
            <div className="overflow-x-auto rounded-md border">
              <Table className="overflow-hidden">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-nowrap font-bold">
                      {t("Library item")}
                    </TableHead>

                    <TableHead className="text-nowrap font-bold">
                      {t("Authors")}
                    </TableHead>

                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">
                        {t("Shelf number")}
                      </div>
                    </TableHead>

                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">ISBN</div>
                    </TableHead>

                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">{t("Actions")}</div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {request.libraryItems.map((item) => (
                    <TableRow key={item.libraryItemId}>
                      <TableCell className="text-nowrap font-bold">
                        <Link
                          target="_blank"
                          href={`/management/books/${item.libraryItemId}`}
                          className="group flex items-center gap-2 pr-8"
                        >
                          {item.coverImage ? (
                            <Image
                              alt={item.title}
                              src={item.coverImage}
                              width={40}
                              height={60}
                              className="aspect-[2/3] h-12 w-8 rounded-sm border object-cover"
                            />
                          ) : (
                            <div className="h-12 w-8 rounded-sm border"></div>
                          )}
                          <p className="font-bold group-hover:underline">
                            {item.title}
                          </p>
                        </Link>
                      </TableCell>
                      <TableCell className="text-nowrap">
                        {item.authors.length > 0 ? (
                          <p>
                            {item.authors.map((a) => a.fullName).join(", ")}
                          </p>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {item.shelf ? (
                            <ShelfBadge shelfNumber={item.shelf.shelfNumber} />
                          ) : (
                            "-"
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">{item.isbn}</div>
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center justify-center">
                          <ItemActionsDropdown
                            libraryCardId={request.libraryCardId}
                            libraryItemId={item.libraryItemId}
                            requestId={request.borrowRequestId}
                            title={item.title}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BorrowRequestDetailPage
