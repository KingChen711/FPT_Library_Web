"use client"

import React from "react"
import { useSearchParams } from "next/navigation"
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
import useDashboardCirculation from "@/hooks/dash-board/use-dashboard-circulation"

import StatCard from "../stat-card"
import BorrowStatsCharts from "./borrow-stats-charts"

function CirculationSection() {
  const t = useTranslations("Dashboard")
  const searchParams = useSearchParams()

  const period =
    searchParams.get("period") || EDashboardPeriodLabel.DAILY.toString()
  const dateRange = parseSearchParamsDateRange(searchParams.getAll("dateRange"))

  const { data, isLoading } = useDashboardCirculation({
    period: +period,
    startDate: dateRange[0],
    endDate: dateRange[1],
  })

  if (isLoading || !data) return

  return (
    <div className="mb-8 rounded-md border p-4">
      <h2 className="mb-4 text-xl font-semibold">
        {t("BorrowReturn Activity Analysis")}
      </h2>

      {/* Summary Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title={t("Total requests")} value={data.totalRequestUnits} />
        <StatCard
          title={t("Total reservations")}
          value={data.totalReservedUnits}
        />
        <StatCard
          title={t("Total failed borrows")}
          value={data.totalBorrowFailed}
        />
        <StatCard
          title={t("Borrow failed rates")}
          value={`${data.borrowFailedRates}%`}
        />
        <StatCard title={t("Total overdue")} value={data.totalOverdue} />
        <StatCard title={t("Overdue rates")} value={`${data.overdueRates}%`} />
        <StatCard title={t("Total lost")} value={data.totalLost} />
        <StatCard title={t("Lost rates")} value={`${data.lostRates}%`} />
      </div>

      {/* Trends */}
      <div className="container mx-auto p-4">
        <div className="flex flex-wrap">
          {/* Total Counts Chart */}
          <div className="w-full p-4 md:w-1/2">
            <h2 className="mb-4 text-center text-lg font-semibold">
              {t("Borrow trends")}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart width={600} height={300} data={data.borrowTrends}>
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
          <div className="w-full p-4 md:w-1/2">
            <h2 className="mb-4 text-center text-lg font-semibold">
              {t("Return trends")}
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart width={600} height={300} data={data.returnTrends}>
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
      </div>

      <BorrowStatsCharts
        categoryBorrowFailedSummary={data.categoryBorrowFailedSummary}
        categoryOverdueSummary={data.categoryOverdueSummary}
      />
    </div>
  )
}

export default CirculationSection
