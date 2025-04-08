import React, { useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

import { cn } from "@/lib/utils"
import { type TDashboardOverView } from "@/hooks/dash-board/use-dashboard-overview"
import { Button } from "@/components/ui/button"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

type Props = {
  inventoryStockCategorySummary: TDashboardOverView["dashboardInventoryAndStock"]["inventoryStockCategorySummary"]
}

function InventoryPieChart({ inventoryStockCategorySummary }: Props) {
  const locale = useLocale()
  const t = useTranslations("Dashboard")

  const [tab, setTab] = useState<
    "stock" | "cataloged" | "instance" | "instance cataloged"
  >("stock")

  // Prepare data for each pie chart
  const stockInData = inventoryStockCategorySummary
    .map((item) => ({
      name:
        locale === "vi"
          ? item.category.vietnameseName
          : item.category.englishName,
      value: item.totalStockInItem,
    }))
    .filter((item) => item.value > 0)

  const instanceData = inventoryStockCategorySummary
    .map((item) => ({
      name:
        locale === "vi"
          ? item.category.vietnameseName
          : item.category.englishName,
      value: item.totalInstanceItem,
    }))
    .filter((item) => item.value > 0)

  const catalogedItemData = inventoryStockCategorySummary
    .map((item) => ({
      name:
        locale === "vi"
          ? item.category.vietnameseName
          : item.category.englishName,
      value: item.totalCatalogedItem,
    }))
    .filter((item) => item.value > 0)

  const catalogedInstanceData = inventoryStockCategorySummary
    .map((item) => ({
      name:
        locale === "vi"
          ? item.category.vietnameseName
          : item.category.englishName,
      value: item.totalCatalogedInstanceItem,
    }))
    .filter((item) => item.value > 0)

  const renderPieChart = (
    data: { name: string; value: number }[],
    title: string,
    show: boolean
  ) => (
    <div className={cn("hidden w-full", show && "block")}>
      <h2 className="text-center text-lg font-semibold">{title}</h2>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={60}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )

  return (
    <div className="mx-auto mt-4 pl-6 lg:mt-0 lg:w-2/5">
      <div className="flex flex-wrap">
        {renderPieChart(
          stockInData,
          t("Total stock in items"),
          tab === "stock"
        )}
        {renderPieChart(
          instanceData,
          t("Total instance items"),
          tab === "cataloged"
        )}
        {renderPieChart(
          catalogedItemData,
          t("Total cataloged items"),
          tab === "instance"
        )}
        {renderPieChart(
          catalogedInstanceData,
          t("Total cataloged instance items"),
          tab === "instance cataloged"
        )}
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <Button
          onClick={() => setTab("stock")}
          size="sm"
          className={cn(tab === "stock" && "border-primary")}
          variant={tab === "stock" ? "outline" : "secondary"}
        >
          {t("Stock in items")}
        </Button>
        <Button
          onClick={() => setTab("cataloged")}
          size="sm"
          className={cn(tab === "cataloged" && "border-primary")}
          variant={tab === "cataloged" ? "outline" : "secondary"}
        >
          {t("Instance items")}
        </Button>
        <Button
          onClick={() => setTab("instance")}
          size="sm"
          className={cn(tab === "instance" && "border-primary")}
          variant={tab === "instance" ? "outline" : "secondary"}
        >
          {t("Cataloged items")}
        </Button>
        <Button
          onClick={() => setTab("instance cataloged")}
          size="sm"
          className={cn(tab === "instance cataloged" && "border-primary")}
          variant={tab === "instance cataloged" ? "outline" : "secondary"}
        >
          {t("Cataloged instance items")}
        </Button>
      </div>
    </div>
  )
}

export default InventoryPieChart
