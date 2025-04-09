"use client"

import React from "react"
import { useTranslations } from "next-intl"
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

interface ChartData {
  availableUnits: number
  needUnits: number
}

const AvailableVsNeedBarChart: React.FC<{
  data: ChartData
  size?: "default" | "sm"
}> = ({ data, size = "default" }) => {
  const t = useTranslations("Dashboard")
  const { availableUnits, needUnits } = data

  // Chuẩn bị dữ liệu cho BarChart
  const chartData = [
    {
      name: t("Units"),
      Available: availableUnits,
      Need: needUnits,
    },
  ]

  return (
    <div className="mx-auto p-4">
      <h2 className="mb-4 text-center text-lg font-semibold">
        {t("Available vs Need Units")}
      </h2>
      <ResponsiveContainer width="100%" height={size === "sm" ? 200 : 300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Available" fill="#8884d8" name={t("Available Units")} />
          <Bar dataKey="Need" fill="#82ca9d" name={t("Need Units")} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AvailableVsNeedBarChart
