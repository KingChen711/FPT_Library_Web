"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts"

import { parseSearchParamsDateRange } from "@/lib/filters"
import { EDashboardPeriodLabel } from "@/lib/types/enums"
import useDashboardTopCirculation from "@/hooks/dash-board/use-dashboard-top-circulation"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import AvailableVsNeedBarChart from "./available-vs-need-chart"

function TopCirculationSection() {
  const t = useTranslations("Dashboard")
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState<"5" | "10" | "30" | "50" | "100">(
    "5"
  )

  const searchParams = useSearchParams()

  const period =
    searchParams.get("period") || EDashboardPeriodLabel.DAILY.toString()
  const dateRange = parseSearchParamsDateRange(searchParams.getAll("dateRange"))

  const { data, isLoading } = useDashboardTopCirculation({
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
        {t("Available vs Need Units Analysis")}
      </h2>

      <AvailableVsNeedBarChart data={data.availableVsNeedChart} />

      <h3 className="mb-2 text-lg font-medium">
        {t("Top circulation library items")}
      </h3>
      <div className="mt-4 grid w-full">
        <div className="overflow-x-auto rounded-md border">
          {data.topBorrowItems.sources.length > 0 && (
            <Table className="overflow-hidden">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-nowrap font-bold">
                    {t("Library item")}
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Borrow success count")}
                    </div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Borrow failed count")}
                    </div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Borrow reserve count")}
                    </div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Extended borrow count")}
                    </div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Digital borrow count")}
                    </div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Borrow failed rates")}
                    </div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Borrow extension rates")}
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topBorrowItems.sources.map((source) => (
                  <TooltipProvider
                    delayDuration={0}
                    key={source.libraryItem.libraryItemId}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TableRow>
                          <TableCell className="text-nowrap font-bold">
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
                            <div className="flex justify-center">
                              {source.borrowSuccessCount}
                            </div>
                          </TableCell>

                          <TableCell className="text-nowrap">
                            <div className="flex justify-center">
                              {source.borrowFailedCount}
                            </div>
                          </TableCell>

                          <TableCell className="text-nowrap">
                            <div className="flex justify-center">
                              {source.reserveCount}
                            </div>
                          </TableCell>

                          <TableCell className="text-nowrap">
                            <div className="flex justify-center">
                              {source.extendedBorrowCount}
                            </div>
                          </TableCell>

                          <TableCell className="text-nowrap">
                            <div className="flex justify-center">
                              {source.digitalBorrowCount}
                            </div>
                          </TableCell>

                          <TableCell className="text-nowrap">
                            <div className="flex justify-center">
                              {source.borrowFailedRate}%
                            </div>
                          </TableCell>
                          <TableCell className="text-nowrap">
                            <div className="flex justify-center">
                              {source.borrowExtensionRate}%
                            </div>
                          </TableCell>
                        </TableRow>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="max-w-[90vw] border bg-card text-card-foreground"
                      >
                        <div className="flex gap-4">
                          <div className="flex flex-wrap">
                            {/* Total Counts Chart */}
                            <div className="w-full min-w-96 p-4 md:w-1/2">
                              <h2 className="mb-4 text-center text-lg font-semibold">
                                {t("Borrow trends")}
                              </h2>
                              <ResponsiveContainer width="100%" height={300}>
                                <LineChart
                                  width={600}
                                  height={300}
                                  data={source.borrowTrends}
                                >
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="periodLabel" />
                                  <YAxis />
                                  <Tooltip />
                                  <Legend />
                                  <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#8884d8"
                                    name={t("Units")}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>

                            {/* Rates Chart */}
                            <div className="w-full min-w-96 p-4 md:w-1/2">
                              <h2 className="mb-4 text-center text-lg font-semibold">
                                {t("Reservations trends")}
                              </h2>
                              <ResponsiveContainer width="100%" height={300}>
                                <LineChart
                                  width={600}
                                  height={300}
                                  data={source.reservationTrends}
                                >
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="periodLabel" />
                                  <YAxis />
                                  <Tooltip />
                                  <Legend />
                                  <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#82ca9d"
                                    name={t("Units")}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                          <AvailableVsNeedBarChart
                            data={source.availableVsNeedChart}
                          />
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </TableBody>
            </Table>
          )}
          {data.topBorrowItems.sources.length === 0 && (
            <div className="flex justify-center p-4">
              <NoData />
            </div>
          )}
        </div>

        <Paginator
          pageSize={+pageSize}
          pageIndex={pageIndex}
          totalPage={data.topBorrowItems.totalPage}
          totalActualItem={data.topBorrowItems.totalActualItem}
          className="mt-6"
          onPaginate={handlePaginate}
          onChangePageSize={handleChangePageSize}
        />
      </div>
    </div>
  )
}

export default TopCirculationSection
