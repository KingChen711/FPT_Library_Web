"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { useTranslations } from "next-intl"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { parseSearchParamsDateRange } from "@/lib/filters"
import { EDashboardPeriodLabel } from "@/lib/types/enums"
import { formatPrice, getFullName } from "@/lib/utils"
import useDashboardFinancial from "@/hooks/dash-board/use-dashboard-financial"
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

import StatCard from "../stat-card"

function FinancialSection() {
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

  const { data, isLoading } = useDashboardFinancial({
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

  const chartData = data.lastYear.map((item, index) => ({
    period: item.periodLabel,
    lastYear: item.value,
    thisYear: data.thisYear[index].value,
  }))

  return (
    <div className="mb-8 rounded-md border p-4">
      <h2 className="mb-4 text-xl font-semibold">
        {t("Financial and Transaction Analysis")}
      </h2>

      <div className="mb-6">
        <h3 className="mb-2 text-lg font-medium">{t("Revenue trends")}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart width={600} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis
              tickFormatter={(value) =>
                new Intl.NumberFormat("vi-VN", {
                  style: "decimal",
                  minimumFractionDigits: 0,
                }).format(value / 1000000)
              }
              label={{
                value: `${t("Million")} ₫`,
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip formatter={(value: number) => formatPrice(value)} />
            <Legend />
            <Line
              type="monotone"
              dataKey="lastYear"
              stroke="#8884d8"
              name={t("Last year")}
            />
            <Line
              type="monotone"
              dataKey="thisYear"
              stroke="#82ca9d"
              name={t("This year")}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          title={t("Last year revenue")}
          value={formatPrice(data.totalRevenueLastYear)}
        />
        <StatCard
          title={t("This year revenue")}
          value={formatPrice(data.totalRevenueThisYear)}
        />
      </div>

      <h3 className="mb-2 text-lg font-medium">{t("Latest transactions")}</h3>
      <div className="mt-4 grid w-full">
        <div className="overflow-x-auto rounded-md border">
          <Table className="overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead className="text-nowrap font-bold">
                  {t("Transaction code")}
                </TableHead>

                <TableHead className="text-nowrap font-bold">
                  {t("Patron")}
                </TableHead>

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">{t("Amount")}</div>
                </TableHead>

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">
                    {t("Transaction at")}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.latestTransactions.sources.map((source) => (
                <TableRow key={source.transactionId}>
                  <TableCell className="text-nowrap font-bold">
                    <Link
                      target="_blank"
                      href={`/management/transactions/${source.transactionId}`}
                      className="hover:underline"
                    >
                      {source.transactionCode}
                    </Link>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <Link
                      target="_blank"
                      href={`/management/library-card-holders/${source.userId}`}
                      className="hover:underline"
                    >
                      {getFullName(source.user.firstName, source.user.lastName)}
                    </Link>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {formatPrice(source.amount)}
                    </div>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {source.transactionDate
                        ? format(
                            new Date(source.transactionDate),
                            "HH:mm dd MMM yyyy",
                            {
                              locale: formatLocale,
                            }
                          )
                        : "-"}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {data.latestTransactions.sources.length === 0 && (
            <div className="flex justify-center p-4">
              <NoData />
            </div>
          )}
        </div>

        <Paginator
          pageSize={+pageSize}
          pageIndex={pageIndex}
          totalPage={data.latestTransactions.totalPage}
          totalActualItem={data.latestTransactions.totalActualItem}
          className="mt-6"
          onPaginate={handlePaginate}
          onChangePageSize={handleChangePageSize}
        />
      </div>
    </div>
  )
}

export default FinancialSection
