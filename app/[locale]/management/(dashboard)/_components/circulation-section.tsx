"use client"

import React from "react"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import StatCard from "./stat-card"

const data = {
  totalRequestUnits: 1,
  totalReservedUnits: 5,
  totalBorrowFailed: 2,
  borrowFailedRates: 100,
  categoryBorrowFailedSummary: [
    {
      category: {
        categoryId: 1,
        prefix: "SD",
        englishName: "SingleBook",
        vietnameseName: "Sách đơn",
        description: null,
        isAllowAITraining: true,
        totalBorrowDays: 30,
      },
      totalBorrowFailed: 1,
      borrowFailedRates: 50,
    },
    {
      category: {
        categoryId: 2,
        prefix: "SB",
        englishName: "BookSeries",
        vietnameseName: "Sách bộ",
        description: null,
        isAllowAITraining: true,
        totalBorrowDays: 30,
      },
      totalBorrowFailed: 0,
      borrowFailedRates: 0,
    },
    {
      category: {
        categoryId: 4,
        prefix: "STK",
        englishName: "ReferenceBook",
        vietnameseName: "Sách tham khảo",
        description: null,
        isAllowAITraining: true,
        totalBorrowDays: 90,
      },
      totalBorrowFailed: 0,
      borrowFailedRates: 0,
    },
    {
      category: {
        categoryId: 5,
        prefix: "TC",
        englishName: "Magazine",
        vietnameseName: "Tạp chí",
        description: null,
        isAllowAITraining: false,
        totalBorrowDays: 30,
      },
      totalBorrowFailed: 0,
      borrowFailedRates: 0,
    },
    {
      category: {
        categoryId: 6,
        prefix: "BC",
        englishName: "Newspaper",
        vietnameseName: "Báo chí",
        description: null,
        isAllowAITraining: false,
        totalBorrowDays: 20,
      },
      totalBorrowFailed: 0,
      borrowFailedRates: 0,
    },
  ],
  totalOverdue: 1,
  overdueRates: 50,
  categoryOverdueSummary: [
    {
      category: {
        categoryId: 1,
        prefix: "SD",
        englishName: "SingleBook",
        vietnameseName: "Sách đơn",
        description: null,
        isAllowAITraining: true,
        totalBorrowDays: 30,
      },
      totalOverdue: 1,
      overdueRates: 50,
    },
    {
      category: {
        categoryId: 2,
        prefix: "SB",
        englishName: "BookSeries",
        vietnameseName: "Sách bộ",
        description: null,
        isAllowAITraining: true,
        totalBorrowDays: 30,
      },
      totalOverdue: 0,
      overdueRates: 0,
    },
    {
      category: {
        categoryId: 4,
        prefix: "STK",
        englishName: "ReferenceBook",
        vietnameseName: "Sách tham khảo",
        description: null,
        isAllowAITraining: true,
        totalBorrowDays: 90,
      },
      totalOverdue: 0,
      overdueRates: 0,
    },
    {
      category: {
        categoryId: 5,
        prefix: "TC",
        englishName: "Magazine",
        vietnameseName: "Tạp chí",
        description: null,
        isAllowAITraining: false,
        totalBorrowDays: 30,
      },
      totalOverdue: 0,
      overdueRates: 0,
    },
    {
      category: {
        categoryId: 6,
        prefix: "BC",
        englishName: "Newspaper",
        vietnameseName: "Báo chí",
        description: null,
        isAllowAITraining: false,
        totalBorrowDays: 20,
      },
      totalOverdue: 0,
      overdueRates: 0,
    },
  ],
  totalLost: 0,
  lostRates: 0,
  categoryLostSummary: [
    {
      category: {
        categoryId: 1,
        prefix: "SD",
        englishName: "SingleBook",
        vietnameseName: "Sách đơn",
        description: null,
        isAllowAITraining: true,
        totalBorrowDays: 30,
      },
      totalLost: 0,
      lostRates: 0,
    },
    {
      category: {
        categoryId: 2,
        prefix: "SB",
        englishName: "BookSeries",
        vietnameseName: "Sách bộ",
        description: null,
        isAllowAITraining: true,
        totalBorrowDays: 30,
      },
      totalLost: 0,
      lostRates: 0,
    },
    {
      category: {
        categoryId: 4,
        prefix: "STK",
        englishName: "ReferenceBook",
        vietnameseName: "Sách tham khảo",
        description: null,
        isAllowAITraining: true,
        totalBorrowDays: 90,
      },
      totalLost: 0,
      lostRates: 0,
    },
    {
      category: {
        categoryId: 5,
        prefix: "TC",
        englishName: "Magazine",
        vietnameseName: "Tạp chí",
        description: null,
        isAllowAITraining: false,
        totalBorrowDays: 30,
      },
      totalLost: 0,
      lostRates: 0,
    },
    {
      category: {
        categoryId: 6,
        prefix: "BC",
        englishName: "Newspaper",
        vietnameseName: "Báo chí",
        description: null,
        isAllowAITraining: false,
        totalBorrowDays: 20,
      },
      totalLost: 0,
      lostRates: 0,
    },
  ],
  borrowTrends: [
    {
      periodLabel: "04-2024",
      count: 0,
    },
    {
      periodLabel: "05-2024",
      count: 0,
    },
    {
      periodLabel: "06-2024",
      count: 0,
    },
    {
      periodLabel: "07-2024",
      count: 0,
    },
    {
      periodLabel: "08-2024",
      count: 0,
    },
    {
      periodLabel: "09-2024",
      count: 0,
    },
    {
      periodLabel: "10-2024",
      count: 0,
    },
    {
      periodLabel: "11-2024",
      count: 0,
    },
    {
      periodLabel: "12-2024",
      count: 0,
    },
    {
      periodLabel: "01-2025",
      count: 0,
    },
    {
      periodLabel: "02-2025",
      count: 0,
    },
    {
      periodLabel: "03-2025",
      count: 0,
    },
    {
      periodLabel: "04-2025",
      count: 2,
    },
  ],
  returnTrends: [
    {
      periodLabel: "04-2024",
      count: 0,
    },
    {
      periodLabel: "05-2024",
      count: 0,
    },
    {
      periodLabel: "06-2024",
      count: 0,
    },
    {
      periodLabel: "07-2024",
      count: 0,
    },
    {
      periodLabel: "08-2024",
      count: 0,
    },
    {
      periodLabel: "09-2024",
      count: 0,
    },
    {
      periodLabel: "10-2024",
      count: 0,
    },
    {
      periodLabel: "11-2024",
      count: 0,
    },
    {
      periodLabel: "12-2024",
      count: 0,
    },
    {
      periodLabel: "01-2025",
      count: 0,
    },
    {
      periodLabel: "02-2025",
      count: 0,
    },
    {
      periodLabel: "03-2025",
      count: 0,
    },
    {
      periodLabel: "04-2025",
      count: 0,
    },
  ],
}

function CirculationSection() {
  return (
    <div className="mb-8">
      <h2 className="mb-4 text-xl font-semibold text-muted-foreground">
        Phân Tích Hoạt Động Mượn/Trả
      </h2>

      {/* Summary Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Tổng Yêu Cầu" value={data.totalRequestUnits} />
        <StatCard
          title="Tổng Đơn Vị Đặt Trước"
          value={data.totalReservedUnits}
        />
        <StatCard title="Tổng Mượn Thất Bại" value={data.totalBorrowFailed} />
        <StatCard
          title="Tỷ Lệ Mượn Thất Bại"
          value={`${data.borrowFailedRates}%`}
        />
        <StatCard title="Tổng Quá Hạn" value={data.totalOverdue} />
        <StatCard title="Tỷ Lệ Quá Hạn" value={`${data.overdueRates}%`} />
        <StatCard title="Tổng Mất" value={data.totalLost} />
        <StatCard title="Tỷ Lệ Mất" value={`${data.lostRates}%`} />
      </div>

      {/* Trends */}
      <div className="flex flex-wrap">
        <div className="mb-6 min-w-[500px] max-w-full flex-1">
          <h3 className="mb-2 text-lg font-medium text-muted-foreground">
            Xu Hướng Mượn
          </h3>
          <LineChart width={600} height={300} data={data.borrowTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodLabel" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              name="Số Lượng"
            />
          </LineChart>
        </div>

        <div className="mb-6 min-w-[500px] max-w-full flex-1">
          <h3 className="mb-2 text-lg font-medium text-muted-foreground">
            Xu Hướng Trả
          </h3>
          <LineChart width={600} height={300} data={data.returnTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="periodLabel" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#82ca9d"
              name="Số Lượng"
            />
          </LineChart>
        </div>
      </div>
    </div>
  )
}

export default CirculationSection
