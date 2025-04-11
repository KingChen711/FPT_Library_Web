import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import getBorrowRecordPatron from "@/queries/borrows/get-borrow-record-patron"
import { format } from "date-fns"
import { Check, X } from "lucide-react"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getLocale } from "@/lib/get-locale"
import { getTranslations } from "@/lib/get-translations"
import BarcodeGenerator from "@/components/ui/barcode-generator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import NoData from "@/components/ui/no-data"
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

import BorrowRecordActionDropdown from "./_components/borrow-record-action-dropdown"

type Props = {
  params: { borrowRecordId: number }
}

async function BorrowRecordDetailPage({ params }: Props) {
  const id = Number(params.borrowRecordId)
  if (!id) notFound()

  const record = await getBorrowRecordPatron(id)

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
              <BreadcrumbLink href="/me/account/borrow">
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
                          href={`/books/${detail.libraryItem.libraryItemId}`}
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
                          <BorrowRecordActionDropdown detail={detail} />
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
