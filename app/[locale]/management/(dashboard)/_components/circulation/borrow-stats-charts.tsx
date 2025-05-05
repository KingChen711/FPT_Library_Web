import React from "react"
import { useLocale, useTranslations } from "next-intl"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { type TDashboardCirculation } from "@/hooks/dash-board/use-dashboard-circulation"

type Props = {
  categoryBorrowFailedSummary: TDashboardCirculation["categoryBorrowFailedSummary"]
  categoryOverdueSummary: TDashboardCirculation["categoryOverdueSummary"]
}

function BorrowStatsCharts({
  categoryBorrowFailedSummary,
  categoryOverdueSummary,
}: Props) {
  const t = useTranslations("Dashboard")
  const locale = useLocale()
  // Combine data for comparison
  const combinedData = categoryBorrowFailedSummary.map((failedItem, index) => ({
    name:
      locale === "vi"
        ? failedItem.category.vietnameseName
        : failedItem.category.englishName,
    borrowFailed: failedItem.totalBorrowFailed,
    failedRate: failedItem.borrowFailedRates,
    overdue: categoryOverdueSummary[index].totalOverdue,
    overdueRate: categoryOverdueSummary[index].overdueRates,
  }))
  // .filter((item) => item.borrowFailed > 0 || item.overdue > 0)

  return (
    <div className="container mx-auto p-4">
      <div className="-mx-4 flex flex-wrap">
        {/* Total Counts Chart */}
        <div className="w-full p-4 md:w-1/2">
          <h2 className="mb-4 text-center text-lg font-semibold">
            {t("Borrow failed vs overdue count")}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                textAnchor="end"
                tick={{ fontSize: 12 }}
                angle={-28}
              />
              <YAxis />
              <Tooltip />
              <Legend wrapperStyle={{ position: "relative" }} />
              <Bar dataKey="borrowFailed" fill="#8884d8" name={t("Failed")} />
              <Bar dataKey="overdue" fill="#82ca9d" name={t("Overdue")} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Rates Chart */}
        <div className="w-full p-4 md:w-1/2">
          <h2 className="mb-4 text-center text-lg font-semibold">
            {t("Borrow failed vs overdue rates")}
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                textAnchor="end"
                tick={{ fontSize: 12 }}
                angle={-28}
              />
              <YAxis />
              <Tooltip />
              <Legend wrapperStyle={{ position: "relative" }} />
              <Bar
                dataKey="failedRate"
                fill="#8884d8"
                name={t("Failed rate")}
              />
              <Bar
                dataKey="overdueRate"
                fill="#82ca9d"
                name={t("Overdue rate")}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default BorrowStatsCharts
