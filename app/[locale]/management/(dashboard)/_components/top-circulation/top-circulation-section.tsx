/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Filter, Plus } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as TooltipChart,
  XAxis,
  YAxis,
} from "recharts"

import { parseSearchParamsDateRange } from "@/lib/filters"
import { EDashboardPeriodLabel, ESearchType } from "@/lib/types/enums"
import { type TSearchTopCirculation } from "@/lib/validations/books/search-top-circulation"
import useDashboardTopCirculation from "@/hooks/dash-board/use-dashboard-top-circulation"
import { Button } from "@/components/ui/button"
import NoData from "@/components/ui/no-data"
import Paginator from "@/components/ui/paginator"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import SearchForm from "@/components/ui/search-form"
import SortableTableHead from "@/components/ui/sortable-table-head"
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
import TopCirculationFilterTabs from "@/components/top-circulation-filter-tabs"

import AvailableVsNeedBarChart from "./available-vs-need-chart"

const initSearchParams: TSearchTopCirculation = {
  pageIndex: 1,
  pageSize: "5",
  search: "",
  f: [],
  o: [],
  v: [],
}

function TopCirculationSection() {
  const t = useTranslations("Dashboard")
  const locale = useLocale()

  const [searchParams, setSearchParams] =
    useState<TSearchTopCirculation>(initSearchParams)

  const browserSearchParams = useSearchParams()

  const period =
    browserSearchParams.get("period") || EDashboardPeriodLabel.DAILY.toString()
  const dateRange = parseSearchParamsDateRange(
    browserSearchParams.getAll("dateRange")
  )

  const { data, isLoading } = useDashboardTopCirculation({
    ...searchParams,
    period: +period,
    startDate: dateRange[0],
    endDate: dateRange[1],
  })

  const handleSort = (sortKey: any) =>
    setSearchParams((prev) => ({
      ...prev,
      sort: sortKey,
      pageIndex: 1,
    }))

  const combinedData =
    data?.availableVsNeedChartCategories.map((item) => ({
      name:
        locale === "vi"
          ? item.category.vietnameseName
          : item.category.englishName,
      availableUnits: item.availableUnits,
      needUnits: item.needUnits,
    })) || []

  if (isLoading || !data) return

  return (
    <div className="mb-8 rounded-md border p-4">
      <h2 className="mb-4 text-xl font-semibold">
        {t("Available vs Need Units Analysis")}
      </h2>

      <div className="mx-auto p-4">
        <h2 className="mb-4 text-center text-lg font-semibold">
          {t("Available vs Need Units")}
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <TooltipChart />
            <Legend />
            <Bar
              dataKey="availableUnits"
              fill="#8884d8"
              name={t("Available Units")}
            />
            <Bar dataKey="needUnits" fill="#82ca9d" name={t("Need Units")} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-medium">
          {t("Top circulation library items")}
        </h3>
        <Button variant="outline" asChild>
          <Link href={`/management/supplement-requests/create`}>
            <Plus />
            {t("Create supplement request")}
          </Link>
        </Button>
      </div>
      <div className="flex flex-row items-center">
        <SearchForm
          className="h-10 rounded-r-none border-r-0"
          search={searchParams.search}
          acceptEmptyTerm
          onSearch={(val) => {
            setSearchParams((prev) => ({
              ...prev,
              search: val,
              searchType: ESearchType.QUICK_SEARCH.toString(),
              pageIndex: 1,
            }))
          }}
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative h-10 rounded-l-none">
              <Filter className="size-4 shrink-0" />
              {t("Filters")}
            </Button>
          </PopoverTrigger>
          <PopoverContent side="bottom" className="w-[650px]">
            <TopCirculationFilterTabs
              searchParams={searchParams}
              setSearchParams={setSearchParams}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="mt-4 grid w-full">
        <div className="overflow-x-auto rounded-md border">
          {data.topBorrowItems.sources.length > 0 && (
            <Table className="overflow-hidden">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-nowrap font-bold">
                    {t("Library item")}
                  </TableHead>

                  <SortableTableHead
                    currentSort={searchParams.sort}
                    label={t("Borrow success count")}
                    sortKey="BorrowSuccessCount"
                    position="center"
                    onSort={handleSort}
                  />

                  <SortableTableHead
                    currentSort={searchParams.sort}
                    label={t("Borrow failed count")}
                    sortKey="BorrowFailedCount"
                    position="center"
                    onSort={handleSort}
                  />

                  <SortableTableHead
                    currentSort={searchParams.sort}
                    label={t("Borrow reserve count")}
                    sortKey="ReserveCount"
                    position="center"
                    onSort={handleSort}
                  />

                  <SortableTableHead
                    currentSort={searchParams.sort}
                    label={t("Extended borrow count")}
                    sortKey="ExtendedBorrowCount"
                    position="center"
                    onSort={handleSort}
                  />

                  <SortableTableHead
                    currentSort={searchParams.sort}
                    label={t("Digital borrow count")}
                    sortKey="DigitalBorrowCount"
                    position="center"
                    onSort={handleSort}
                  />

                  <SortableTableHead
                    currentSort={searchParams.sort}
                    label={t("Borrow failed rates")}
                    sortKey="BorrowFailedRate"
                    position="center"
                    onSort={handleSort}
                  />

                  <SortableTableHead
                    currentSort={searchParams.sort}
                    label={t("Borrow extension rates")}
                    sortKey="BorrowExtensionRate"
                    position="center"
                    onSort={handleSort}
                  />
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
                                  <TooltipChart />
                                  <Legend />
                                  <Line
                                    type="monotone"
                                    dataKey="value"
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
                                  <TooltipChart />
                                  <Legend />
                                  <Line
                                    type="monotone"
                                    dataKey="value"
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
          pageSize={+data.topBorrowItems.pageSize}
          pageIndex={+data.topBorrowItems.pageIndex}
          totalPage={data.topBorrowItems.totalPage}
          totalActualItem={data.topBorrowItems.totalActualItem}
          className="mt-6"
          onPaginate={(page) =>
            setSearchParams((prev) => ({
              ...prev,
              pageIndex: page,
            }))
          }
          onChangePageSize={(size) =>
            setSearchParams((prev) => ({
              ...prev,
              pageSize: size,
            }))
          }
        />
      </div>
    </div>
  )
}

export default TopCirculationSection
