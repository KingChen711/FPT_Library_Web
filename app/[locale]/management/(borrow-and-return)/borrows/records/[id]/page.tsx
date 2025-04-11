import React from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { auth } from "@/queries/auth"
import getBorrowRecord from "@/queries/borrows/get-borrow-record"
import { format } from "date-fns"
import { Check, Eye, MoreHorizontal, Navigation, X } from "lucide-react"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getLocale } from "@/lib/get-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { formatPrice } from "@/lib/utils"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import BorrowRecordStatusBadge from "@/components/badges/borrow-record-status-badge"
import BorrowTypeBadge from "@/components/badges/borrow-type-bade"
import CardStatusBadge from "@/components/badges/card-status-badge"
import FineBorrowStatusBadge from "@/components/badges/fine-borrow-status"
import FineTypeBadge from "@/components/badges/fine-type-badge"
import IssuanceMethodBadge from "@/components/badges/issuance-method-badge"

type Props = {
  params: { id: number }
}

async function BorrowRecordDetailPage({ params }: Props) {
  await auth().protect(EFeature.BORROW_MANAGEMENT)

  const id = Number(params.id)
  if (!id) notFound()

  const record = await getBorrowRecord(id)

  if (!record) notFound()

  const locale = await getLocale()
  const formatLocale = await getFormatLocale()

  const title = `${record.librarycard.fullName} - ${format(
    record.borrowDate,
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
              <BreadcrumbLink href="/management/borrows/records">
                {t("Borrow records")}
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
                {record.borrowDate ? (
                  <p>
                    {format(record.borrowDate, "dd MMM yyyy", {
                      locale: formatLocale,
                    })}
                  </p>
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Borrow type")}</h4>
              <div className="flex gap-2">
                <BorrowTypeBadge status={record.borrowType} />
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Total record items")}</h4>
              <div className="flex gap-2">{record.totalRecordItem}</div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Has fine to payment")}</h4>
              <div className="flex gap-2">
                {record.hasFineToPayment ? (
                  <Check className="text-success" />
                ) : (
                  <X className="text-danger" />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Process by")}</h4>
              <div className="flex items-center gap-2">
                {record.processedByNavigation.email}
              </div>
            </div>
          </div>
        </div>

        {record.librarycard && (
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
                  <Copitor content={record.librarycard.fullName} />
                  <p>{record.librarycard.fullName}</p>
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                <h4 className="font-bold">{t("Avatar on card")}</h4>
                <div className="flex gap-2">
                  <Avatar className="size-8">
                    <AvatarImage src={record.librarycard.avatar || ""} />
                    <AvatarFallback>
                      {record.librarycard.fullName
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
                    value={record.librarycard.barcode}
                    options={{
                      format: "CODE128",
                      displayValue: true,
                      fontSize: 12,
                      width: 1,
                      height: 18,
                    }}
                  />
                  <Copitor content={record.librarycard.barcode} />
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                <h4 className="font-bold">{t("Status")}</h4>
                <div className="flex gap-2">
                  <CardStatusBadge status={record.librarycard.status} />
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Issuance method")}</h4>
                <div className="flex items-center gap-2">
                  <IssuanceMethodBadge
                    status={record.librarycard.issuanceMethod}
                  />
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                <h4 className="font-bold">{t("Allow borrow more")}</h4>
                <div className="flex gap-2">
                  {record.librarycard.isAllowBorrowMore ? (
                    <Check className="size-6 text-success" />
                  ) : (
                    <X className="size-6 text-danger" />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Max item once time")}</h4>
                <div className="flex gap-2">
                  <p>{record.librarycard.maxItemOnceTime}</p>
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                <h4 className="font-bold">{t("Allow borrow more reason")}</h4>
                <div className="flex items-center gap-2">
                  {record.librarycard.allowBorrowMoreReason ? (
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
                              data={record.librarycard.allowBorrowMoreReason}
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
                  {record.librarycard.isReminderSent ? (
                    <Check className="size-6 text-success" />
                  ) : (
                    <X className="size-6 text-danger" />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                <h4 className="font-bold">{t("Extended")}</h4>
                <div className="flex gap-2">
                  {record.librarycard.isExtended ? (
                    <Check className="size-6 text-success" />
                  ) : (
                    <X className="size-6 text-danger" />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Extension count")}</h4>
                <div className="flex gap-2">
                  <p>{record.librarycard.extensionCount}</p>
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                <h4 className="font-bold">{t("Total missed pick up")}</h4>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    {record.librarycard.totalMissedPickUp ?? <NoData />}
                  </div>
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
                <h4 className="font-bold">{t("Issue date")}</h4>
                <div className="flex items-center gap-2">
                  {record.librarycard.issueDate ? (
                    <p>
                      {format(record.librarycard.issueDate, "dd MMM yyyy", {
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
                  {record.librarycard.expiryDate ? (
                    <p>
                      {format(record.librarycard.expiryDate, "dd MMM yyyy", {
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
                  {record.librarycard.suspensionReason ? (
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
                              data={record.librarycard.suspensionReason}
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
                    {record.librarycard.rejectReason ? (
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
                                data={record.librarycard.rejectReason}
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
                  {record.librarycard.isArchived ? (
                    <Check className="size-6 text-success" />
                  ) : (
                    <X className="size-6 text-danger" />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
                <h4 className="font-bold">{t("Archive reason")}</h4>
                <div className="flex gap-2">
                  {record.librarycard.archiveReason ? (
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
                              data={record.librarycard.archiveReason}
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
                  {record.librarycard.transactionCode ? (
                    record.librarycard.transactionCode
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>

              <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
                <h4 className="font-bold">{t("Suspension end date")}</h4>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    {record.librarycard.suspensionEndDate ? (
                      <p>
                        {format(
                          record.librarycard.suspensionEndDate,
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
          <h3 className="text-xl font-semibold">
            {t("Borrow record details")}
          </h3>

          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-row items-center"></div>
            </div>
            <div className="flex flex-wrap items-center gap-4"></div>
          </div>

          <div className="grid w-full">
            <div className="overflow-x-auto rounded-md border">
              <Table className="overflow-hidden">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-nowrap font-bold">
                      {t("Library item")}
                    </TableHead>

                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">{t("Barcode")}</div>
                    </TableHead>

                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">{t("Due date")}</div>
                    </TableHead>

                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">
                        {t("Return date")}
                      </div>
                    </TableHead>

                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">{t("Status")}</div>
                    </TableHead>

                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">
                        {t("Total extension")}
                      </div>
                    </TableHead>
                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">
                        {t("Condition")}
                      </div>
                    </TableHead>

                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">
                        {t("Return condition")}
                      </div>
                    </TableHead>

                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">
                        {t("Is reminder sent")}
                      </div>
                    </TableHead>

                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">
                        {t("Has fines")}
                      </div>
                    </TableHead>

                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">{t("Actions")}</div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {record.borrowRecordDetails.map((detail) => (
                    <TableRow key={detail.borrowRecordId}>
                      <TableCell className="text-nowrap font-bold">
                        <Link
                          target="_blank"
                          href={`/management/books/${detail.libraryItem.libraryItemId}`}
                          className="group flex items-center gap-2 pr-8"
                        >
                          {detail.libraryItem.coverImage ? (
                            <Image
                              alt={detail.libraryItem.title}
                              src={detail.libraryItem.coverImage}
                              width={40}
                              height={60}
                              className="aspect-[2/3] h-12 w-8 rounded-sm border object-cover"
                            />
                          ) : (
                            <div className="h-12 w-8 rounded-sm border"></div>
                          )}
                          <p className="font-bold group-hover:underline">
                            {detail.libraryItem.title}
                          </p>
                        </Link>
                      </TableCell>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          <BarcodeGenerator
                            value={
                              detail.libraryItem.libraryItemInstances[0].barcode
                            }
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
                        </div>
                      </TableCell>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {detail.dueDate ? (
                            <p>
                              {format(detail.dueDate, "dd MMM yyyy", {
                                locale: formatLocale,
                              })}
                            </p>
                          ) : (
                            "-"
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {detail.returnDate ? (
                            <p>
                              {format(detail.returnDate, "dd MMM yyyy", {
                                locale: formatLocale,
                              })}
                            </p>
                          ) : (
                            "-"
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          <BorrowRecordStatusBadge status={detail.status} />
                        </div>
                      </TableCell>

                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {detail.totalExtension ?? "-"}
                        </div>
                      </TableCell>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {detail.condition
                            ? locale === "vi"
                              ? detail.condition.vietnameseName
                              : detail.condition.englishName
                            : "-"}
                        </div>
                      </TableCell>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {detail.returnCondition
                            ? locale === "vi"
                              ? detail.returnCondition.vietnameseName
                              : detail.returnCondition.englishName
                            : "-"}
                        </div>
                      </TableCell>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {detail.isReminderSent ? (
                            <Check className="text-success" />
                          ) : (
                            <X className="text-danger" />
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {detail.fines.length > 0 ? (
                            <Check className="text-success" />
                          ) : (
                            <X className="text-danger" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <Dialog>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>
                                  <Link
                                    target="_blank"
                                    href={`/management/books/${detail.libraryItem.libraryItemId}`}
                                    className="flex items-center gap-2"
                                  >
                                    <Navigation className="size-4" />
                                    {t("View library item")}
                                  </Link>
                                </DropdownMenuItem>
                                {detail.fines.length > 0 && (
                                  <DialogTrigger asChild>
                                    <DropdownMenuItem className="cursor-pointer">
                                      <Eye className="size-4" />
                                      {t("View fines")}
                                    </DropdownMenuItem>
                                  </DialogTrigger>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <DialogContent className="max-h-[80vh] max-w-6xl overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>{t("Fines")}</DialogTitle>
                                <DialogDescription asChild>
                                  <div className="grid w-full">
                                    <div className="overflow-x-auto rounded-md border">
                                      <Table className="overflow-hidden">
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead className="text-nowrap font-bold">
                                              {t("Title")}
                                            </TableHead>

                                            <TableHead className="text-nowrap font-bold">
                                              <div className="flex justify-center">
                                                {t("Fine type")}
                                              </div>
                                            </TableHead>
                                            <TableHead className="text-nowrap font-bold">
                                              <div className="flex justify-center">
                                                {t("Fine amount")}
                                              </div>
                                            </TableHead>
                                            <TableHead className="text-nowrap font-bold">
                                              <div className="flex justify-center">
                                                {t("Status")}
                                              </div>
                                            </TableHead>
                                            <TableHead className="text-nowrap font-bold">
                                              <div className="flex justify-center">
                                                {t("Fine note")}
                                              </div>
                                            </TableHead>
                                            <TableHead className="text-nowrap font-bold">
                                              <div className="flex justify-center">
                                                {t("Created at")}
                                              </div>
                                            </TableHead>
                                            <TableHead className="text-nowrap font-bold">
                                              <div className="flex justify-center">
                                                {t("Expiry at")}
                                              </div>
                                            </TableHead>
                                            <TableHead className="text-nowrap font-bold">
                                              <div className="flex justify-center">
                                                {t("Created by")}
                                              </div>
                                            </TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {detail.fines.map((fine) => (
                                            <TableRow key={fine.fineId}>
                                              <TableCell className="text-nowrap">
                                                {
                                                  fine.finePolicy
                                                    .finePolicyTitle
                                                }
                                              </TableCell>
                                              <TableCell className="text-nowrap">
                                                <div className="flex justify-center">
                                                  <FineTypeBadge
                                                    type={
                                                      fine.finePolicy
                                                        .conditionType
                                                    }
                                                  />
                                                </div>
                                              </TableCell>
                                              <TableCell className="text-nowrap">
                                                <div className="flex justify-center">
                                                  {formatPrice(fine.fineAmount)}
                                                </div>
                                              </TableCell>
                                              <TableCell className="text-nowrap">
                                                <div className="flex justify-center">
                                                  <FineBorrowStatusBadge
                                                    status={fine.status}
                                                  />
                                                </div>
                                              </TableCell>
                                              <TableCell className="text-nowrap">
                                                <div className="flex justify-center">
                                                  {fine.fineNote ? (
                                                    <Dialog>
                                                      <DialogTrigger asChild>
                                                        <Button
                                                          variant="outline"
                                                          size="sm"
                                                        >
                                                          {t("View content")}
                                                        </Button>
                                                      </DialogTrigger>
                                                      <DialogContent className="max-h-[80vh] overflow-y-auto overflow-x-hidden">
                                                        <DialogHeader>
                                                          <DialogTitle>
                                                            {t(
                                                              "Allow borrow more reason"
                                                            )}
                                                          </DialogTitle>
                                                          <DialogDescription>
                                                            <ParseHtml
                                                              data={
                                                                fine.fineNote
                                                              }
                                                            />
                                                          </DialogDescription>
                                                        </DialogHeader>
                                                      </DialogContent>
                                                    </Dialog>
                                                  ) : (
                                                    "-"
                                                  )}
                                                </div>
                                              </TableCell>
                                              <TableCell className="text-nowrap">
                                                <div className="flex justify-center">
                                                  {fine.createdAt ? (
                                                    <p>
                                                      {format(
                                                        fine.createdAt,
                                                        "HH:mm dd MMM yyyy",
                                                        {
                                                          locale: formatLocale,
                                                        }
                                                      )}
                                                    </p>
                                                  ) : (
                                                    "-"
                                                  )}
                                                </div>
                                              </TableCell>
                                              <TableCell className="text-nowrap">
                                                <div className="flex justify-center">
                                                  {fine.expiryAt ? (
                                                    <p>
                                                      {format(
                                                        fine.expiryAt,
                                                        "HH:mm dd MMM yyyy",
                                                        {
                                                          locale: formatLocale,
                                                        }
                                                      )}
                                                    </p>
                                                  ) : (
                                                    "-"
                                                  )}
                                                </div>
                                              </TableCell>
                                              <TableCell className="text-nowrap">
                                                <div className="flex justify-center">
                                                  {
                                                    fine.createByNavigation
                                                      .email
                                                  }
                                                </div>
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </div>
                                  </div>
                                </DialogDescription>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
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

export default BorrowRecordDetailPage
