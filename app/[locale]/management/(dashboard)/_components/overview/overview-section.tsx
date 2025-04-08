"use client"

import React from "react"
import { useTranslations } from "next-intl"

import useDashboardOverview from "@/hooks/dash-board/use-dashboard-overview"
import { Skeleton } from "@/components/ui/skeleton"

import StatCard, { StatCardSkeleton } from "../stat-card"
import InventoryPieChart from "./inventory-pie-chart"

function OverviewSection() {
  const t = useTranslations("Dashboard")
  const { data, isLoading } = useDashboardOverview()

  if (isLoading) return <OverviewSectionSkeleton />

  if (!data) return null

  return (
    <div className="mb-8 mt-4 rounded-md border p-4">
      <h2 className="mb-4 text-xl font-semibold">{t("Overview")}</h2>
      <div className="flex flex-wrap">
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:w-3/5 lg:grid-cols-4">
          <StatCard
            title={t("Total physical items")}
            value={data.dashboardOverView.totalItemUnits}
          />
          <StatCard
            title={t("Total digital items")}
            value={data.dashboardOverView.totalDigitalUnits}
          />
          <StatCard
            title={t("Total borrowing items")}
            value={data.dashboardOverView.totalBorrowingUnits}
          />
          <StatCard
            title={t("Total overdue items")}
            value={data.dashboardOverView.totalOverdueUnits}
          />
          <StatCard
            title={t("Total patrons")}
            value={data.dashboardOverView.totalPatrons}
          />
          <StatCard
            title={t("Total instance units")}
            value={data.dashboardOverView.totalInstanceUnits}
          />
          <StatCard
            title={t("Total available units")}
            value={data.dashboardOverView.totalAvailableUnits}
          />
          <StatCard
            title={t("Total lost units")}
            value={data.dashboardOverView.totalLostUnits}
          />
        </div>

        <InventoryPieChart
          inventoryStockCategorySummary={
            data.dashboardInventoryAndStock.inventoryStockCategorySummary
          }
        />
      </div>
    </div>
  )
}

export default OverviewSection

export function OverviewSectionSkeleton() {
  return (
    <div className="mb-8 mt-4 rounded-md border p-4">
      <Skeleton className="h-7 w-[100x]" />
      <div className="flex flex-wrap justify-between">
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:w-3/5 lg:grid-cols-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>

        <Skeleton className="h-[300x] w-full border lg:w-[calc(40%-24px)]" />
      </div>
    </div>
  )
}
