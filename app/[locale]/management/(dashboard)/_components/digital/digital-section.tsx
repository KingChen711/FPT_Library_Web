"use client"

import React, { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Link } from "@/i18n/routing"
import { format } from "date-fns"
import { useTranslations } from "next-intl"

import { parseSearchParamsDateRange } from "@/lib/filters"
import { EDashboardPeriodLabel } from "@/lib/types/enums"
import { formatFileSize } from "@/lib/utils"
import useDashboardDigital from "@/hooks/dash-board/use-dashboard-digital"
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
import ResourceBookTypeBadge from "@/components/badges/book-resource-type-badge"

import StatCard from "../stat-card"

function DigitalResourcesSection() {
  const formatLocale = useFormatLocale()
  const t = useTranslations("Dashboard")
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState<"5" | "10" | "30" | "50" | "100">(
    "5"
  )

  const searchParams = useSearchParams()

  const period =
    searchParams.get("period") || EDashboardPeriodLabel.DAILY.toString()
  const dateRange = parseSearchParamsDateRange(searchParams.getAll("dateRange"))

  const { data, isLoading } = useDashboardDigital({
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

  if (isLoading || !data) return

  return (
    <div className="mb-8 rounded-md border p-4">
      <h2 className="mb-4 text-xl font-semibold">
        {t("Digital resources analysis")}
      </h2>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t("Total digital resources")}
          value={data.totalDigitalResource}
        />
        <StatCard
          title={t("Total active borrowing")}
          value={data.totalActiveDigitalBorrowing}
        />
        <StatCard
          title={t("Extend rates")}
          value={`${data.extensionRatePercentage}%`}
        />
        <StatCard
          title={t("Average extend count")}
          value={data.averageExtensionsPerBorrow}
        />
      </div>

      <h3 className="mb-2 text-lg font-medium">
        {t("Top borrowed digital resources")}
      </h3>
      <div className="mt-4 grid w-full">
        <div className="overflow-x-auto rounded-md border">
          <Table className="overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead className="text-nowrap font-bold">
                  {t("Title")}
                </TableHead>

                <TableHead className="text-nowrap font-bold">
                  {t("Type")}
                </TableHead>

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">{t("Size")}</div>
                </TableHead>

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">
                    {t("Total borrowed")}
                  </div>
                </TableHead>

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">
                    {t("Total extension")}
                  </div>
                </TableHead>

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">
                    {t("Average borrow duration")}
                  </div>
                </TableHead>

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">
                    {t("Extension rates")}
                  </div>
                </TableHead>

                <TableHead className="text-nowrap font-bold">
                  {t("Last borrowed")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topBorrowLibraryResources.sources.map((source) => (
                <TableRow key={source.libraryResource.resourceId}>
                  <TableCell className="text-nowrap font-bold">
                    <Link
                      target="_blank"
                      href={`/management/resources/${source.libraryResource.resourceId}`}
                      className="hover:underline"
                    >
                      {source.libraryResource.resourceTitle}
                    </Link>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <ResourceBookTypeBadge
                      status={source.libraryResource.resourceType}
                    />
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {formatFileSize(source.libraryResource.resourceSize)}
                    </div>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {source.totalBorrowed}
                    </div>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {source.totalExtension}
                    </div>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {source.averageBorrowDuration}
                    </div>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {Math.round(source.extensionRate)}%
                    </div>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {source.lastBorrowDate
                      ? format(new Date(source.lastBorrowDate), "dd MMM yyyy", {
                          locale: formatLocale,
                        })
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {data.topBorrowLibraryResources.sources.length === 0 && (
            <div className="flex justify-center p-4">
              <NoData />
            </div>
          )}
        </div>

        <Paginator
          pageSize={+pageSize}
          pageIndex={pageIndex}
          totalPage={data.topBorrowLibraryResources.totalPage}
          totalActualItem={data.topBorrowLibraryResources.totalActualItem}
          className="mt-6"
          onPaginate={handlePaginate}
          onChangePageSize={handleChangePageSize}
        />
      </div>
    </div>
  )
}

export default DigitalResourcesSection
