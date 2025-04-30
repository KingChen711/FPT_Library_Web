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

function SelectTopCirculationDialog({
  onSelect,
  disabled = false,

  selectedItemIds,
}: Props) {
  const t = useTranslations("Dashboard")
  const [open, setOpen] = useState(false)
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState<"5" | "10" | "30" | "50" | "100">(
    "5"
  )

  const { data, isLoading } = useDashboardTopCirculation({
    pageIndex,
    pageSize,
    period: EDashboardPeriodLabel.DAILY,
    startDate: null,
    endDate: null,
    f: [],
    o: [],
    v: [],
    search: "",
  })

  const handlePaginate = (selectedPage: number) => {
    setPageIndex(selectedPage)
  }

  const handleChangePageSize = (size: "5" | "10" | "30" | "50" | "100") => {
    setPageSize(size)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          <Plus />
          {t("Select top items")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-7xl">
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
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data?.topBorrowItems.sources.map((source) => (
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
                    pageSize={+pageSize}
                    pageIndex={pageIndex}
                    totalPage={data.topBorrowItems.totalPage}
                    totalActualItem={data.topBorrowItems.totalActualItem}
                    className="mt-6"
                    onPaginate={handlePaginate}
                    onChangePageSize={handleChangePageSize}
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
