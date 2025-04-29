"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { useTranslations } from "next-intl"

import { parseSearchParamsDateRange } from "@/lib/filters"
import { EDashboardPeriodLabel } from "@/lib/types/enums"
import useOverdueBorrows from "@/hooks/dash-board/use-overdue-borrows"
import useFormatLocale from "@/hooks/utils/use-format-locale"
import NoData from "@/components/ui/no-data"
import Paginator from "@/components/ui/paginator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import BorrowRecordStatusBadge from "@/components/badges/borrow-record-status-badge"

function OverdueBorrowsSection() {
  const t = useTranslations("Dashboard")
  const formatLocale = useFormatLocale()
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState<"5" | "10" | "30" | "50" | "100">(
    "5"
  )

  const searchParams = useSearchParams()

  const period =
    searchParams.get("period") || EDashboardPeriodLabel.DAILY.toString()
  const dateRange = parseSearchParamsDateRange(searchParams.getAll("dateRange"))

  const { data, isLoading } = useOverdueBorrows({
    period: +period,
    startDate: dateRange[0],
    endDate: dateRange[1],
    pageIndex,
    pageSize,
  })

  const handlePaginate = (selectedPage: number) => {
    setPageIndex(selectedPage)
  }

  const handleChangePageSize = (size: "5" | "10" | "30" | "50" | "100") => {
    setPageSize(size)
  }

  if (isLoading || !data) return null

  return (
    <div className="mb-8 rounded-md border p-4">
      <h2 className="mb-4 text-xl font-semibold">{t("Overdue borrow")}</h2>
      <div className="mt-4 grid w-full">
        <div className="overflow-x-auto rounded-md border">
          {data.sources.length > 0 && (
            <Table className="overflow-hidden">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-nowrap font-bold">
                    {t("Library item")}
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    {t("Patron")}
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    {t("Due date")}
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">{t("Status")}</div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.sources.map((source) => (
                  <TableRow
                    key={source.borrowRecordDetail.borrowRecordDetailId}
                  >
                    <TableCell className="text-nowrap">
                      <Link
                        target="_blank"
                        href={`/management/books/${source.libraryItem.libraryItemId}`}
                        className="group flex items-center gap-2 pr-8"
                      >
                        {source.libraryItem.coverImage ? (
                          <Image
                            alt={source.libraryItem.title}
                            src={source.libraryItem.coverImage}
                            width={40}
                            height={60}
                            className="aspect-[2/3] h-12 w-8 rounded-sm border object-cover"
                          />
                        ) : (
                          <div className="h-12 w-8 rounded-sm border"></div>
                        )}
                        <p className="font-bold group-hover:underline">
                          {source.libraryItem.title}
                        </p>
                      </Link>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <Link
                        target="_blank"
                        href={`/management/library-cards/${source.libraryCard.libraryCardId}`}
                        className="hover:underline"
                      >
                        {source.libraryCard.fullName}
                      </Link>
                    </TableCell>

                    <TableCell className="text-nowrap font-bold">
                      <Link
                        target="_blank"
                        href={`/management/borrows/records/${source.borrowRecordDetail.borrowRecordId}`}
                        className="hover:underline"
                      >
                        {source.borrowRecordDetail.dueDate
                          ? format(
                              new Date(source.borrowRecordDetail.dueDate),
                              "dd MMM yyyy",
                              {
                                locale: formatLocale,
                              }
                            )
                          : "-"}
                      </Link>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        <BorrowRecordStatusBadge
                          status={source.borrowRecordDetail.status}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {data.sources.length === 0 && (
            <div className="flex justify-center p-4">
              <NoData />
            </div>
          )}
        </div>

        <Paginator
          pageSize={+pageSize}
          pageIndex={pageIndex}
          totalPage={data.totalPage}
          totalActualItem={data.totalActualItem}
          className="mt-6"
          onPaginate={handlePaginate}
          onChangePageSize={handleChangePageSize}
        />
      </div>
    </div>
  )
}

export default OverdueBorrowsSection
