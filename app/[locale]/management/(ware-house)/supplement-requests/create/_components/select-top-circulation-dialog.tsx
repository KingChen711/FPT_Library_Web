/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Loader2, Plus } from "lucide-react"
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

import { EDashboardPeriodLabel } from "@/lib/types/enums"
import { type TSearchTopCirculation } from "@/lib/validations/books/search-top-circulation"
import useDashboardTopCirculation, {
  type TDashboardTopCirculation,
} from "@/hooks/dash-board/use-dashboard-top-circulation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import NoData from "@/components/ui/no-data"
import Paginator from "@/components/ui/paginator"
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
import AvailableVsNeedBarChart from "@/app/[locale]/management/(dashboard)/_components/top-circulation/available-vs-need-chart"

type Props = {
  selectedItemIds: number[]
  onSelect: (
    item: TDashboardTopCirculation["topBorrowItems"]["sources"][number]
  ) => void
  disabled?: boolean
  disableFineIds?: number[]
  isLost?: boolean
  isOverdue?: boolean
}

const initSearchParams: TSearchTopCirculation = {
  pageIndex: 1,
  pageSize: "5",
  search: "",
  f: [],
  o: [],
  v: [],
  sort: "SatisfactionRate",
}

function SelectTopCirculationDialog({
  onSelect,
  disabled = false,

  selectedItemIds,
}: Props) {
  const t = useTranslations("Dashboard")
  const [open, setOpen] = useState(false)

  const [searchParams, setSearchParams] =
    useState<TSearchTopCirculation>(initSearchParams)

  const { data, isLoading } = useDashboardTopCirculation({
    pageIndex: searchParams.pageIndex,
    pageSize: searchParams.pageSize,
    period: EDashboardPeriodLabel.DAILY,
    startDate: null,
    endDate: null,
    f: [],
    o: [],
    v: [],
    search: "",
    sort: searchParams.sort,
  })

  const handleSort = (sortKey: any) =>
    setSearchParams((prev) => ({
      ...prev,
      sort: sortKey,
      pageIndex: 1,
    }))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          <Plus />
          {t("Select top items")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-7xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Top circulation library items")}</DialogTitle>
          <DialogDescription asChild>
            <>
              {isLoading && (
                <div className="my-10 flex justify-between">
                  <Loader2 className="size-9 animate-spin" />
                </div>
              )}

              <div className="mt-4 grid w-full">
                <div className="overflow-x-auto rounded-md border">
                  {data && data.topBorrowItems.sources.length > 0 && (
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
                            label={t("Borrow request count")}
                            sortKey="BorrowRequestCount"
                            position="center"
                            onSort={handleSort}
                          />

                          <SortableTableHead
                            currentSort={searchParams.sort}
                            label={t("Total satisfaction units")}
                            sortKey="TotalSatisfactionUnits"
                            position="center"
                            onSort={handleSort}
                          />

                          <SortableTableHead
                            currentSort={searchParams.sort}
                            label={t("Satisfaction rate")}
                            sortKey="SatisfactionRate"
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
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data?.topBorrowItems.sources.map((source) => (
                          <TooltipProvider
                            delayDuration={500}
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
                                      {source.borrowRequestCount}
                                    </div>
                                  </TableCell>

                                  <TableCell className="text-nowrap">
                                    <div className="flex justify-center">
                                      {source.totalSatisfactionUnits}
                                    </div>
                                  </TableCell>

                                  <TableCell className="text-nowrap">
                                    <div className="flex justify-center">
                                      {source.satisfactionRate}%
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-nowrap">
                                    <div className="flex justify-center">
                                      {source.borrowExtensionRate}%
                                    </div>
                                  </TableCell>

                                  <TableCell className="text-nowrap">
                                    {selectedItemIds.includes(
                                      source.libraryItem.libraryItemId
                                    ) ? (
                                      <Button disabled>{t("Selected")}</Button>
                                    ) : (
                                      <Button onClick={() => onSelect(source)}>
                                        {t("Select")}
                                      </Button>
                                    )}
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
                                      <ResponsiveContainer
                                        width="100%"
                                        height={200}
                                      >
                                        <LineChart
                                          width={400}
                                          height={200}
                                          data={source.borrowTrends}
                                        >
                                          <CartesianGrid strokeDasharray="3 3" />
                                          <XAxis dataKey="periodLabel" />
                                          <YAxis />
                                          <Tooltip />
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
                                      <ResponsiveContainer
                                        width="100%"
                                        height={200}
                                      >
                                        <LineChart
                                          width={400}
                                          height={200}
                                          data={source.reservationTrends}
                                        >
                                          <CartesianGrid strokeDasharray="3 3" />
                                          <XAxis dataKey="periodLabel" />
                                          <YAxis />
                                          <Tooltip />
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
                                    size="sm"
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
                  {data?.topBorrowItems.sources.length === 0 && (
                    <div className="flex justify-center p-4">
                      <NoData />
                    </div>
                  )}
                </div>

                {data && (
                  <Paginator
                    pageSize={+searchParams.pageSize}
                    pageIndex={searchParams.pageIndex}
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
                )}
              </div>
            </>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default SelectTopCirculationDialog
