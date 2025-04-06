"use client"

import React from "react"
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts"

import { Tooltip } from "@/components/ui/tooltip"

import StatCard from "./stat-card"

const data = {
  lastYear: [
    {
      periodLabel: "Tháng 1",
      count: 10656164.0,
    },
    {
      periodLabel: "Tháng 2",
      count: 10762793.0,
    },
    {
      periodLabel: "Tháng 3",
      count: 8726177.0,
    },
    {
      periodLabel: "Tháng 4",
      count: 11073736.0,
    },
    {
      periodLabel: "Tháng 5",
      count: 12954429.0,
    },
    {
      periodLabel: "Tháng 6",
      count: 7238312.0,
    },
    {
      periodLabel: "Tháng 7",
      count: 13016896.0,
    },
    {
      periodLabel: "Tháng 8",
      count: 6371039.0,
    },
    {
      periodLabel: "Tháng 9",
      count: 11305896.0,
    },
    {
      periodLabel: "Tháng 10",
      count: 13002499.0,
    },
    {
      periodLabel: "Tháng 11",
      count: 12133221.0,
    },
    {
      periodLabel: "Tháng 12",
      count: 13141532.0,
    },
  ],
  thisYear: [
    {
      periodLabel: "Tháng 1",
      count: 9369284.0,
    },
    {
      periodLabel: "Tháng 2",
      count: 12044870.0,
    },
    {
      periodLabel: "Tháng 3",
      count: 8661167.0,
    },
    {
      periodLabel: "Tháng 4",
      count: 440960.0,
    },
    {
      periodLabel: "Tháng 5",
      count: 0,
    },
    {
      periodLabel: "Tháng 6",
      count: 0,
    },
    {
      periodLabel: "Tháng 7",
      count: 0,
    },
    {
      periodLabel: "Tháng 8",
      count: 0,
    },
    {
      periodLabel: "Tháng 9",
      count: 0,
    },
    {
      periodLabel: "Tháng 10",
      count: 0,
    },
    {
      periodLabel: "Tháng 11",
      count: 0,
    },
    {
      periodLabel: "Tháng 12",
      count: 0,
    },
  ],
  totalRevenueLastYear: 130382694.0,
  totalRevenueThisYear: 30516281.0,
  latestTransactions: {
    sources: [
      {
        transactionId: 9,
        transactionCode: "61560746",
        userId: "34858b29-7110-f011-929c-346f24123636",
        amount: 2000.0,
        description: null,
        transactionStatus: 2,
        transactionType: 2,
        transactionDate: "2025-04-03T16:51:05.72",
        expiredAt: null,
        createdAt: "2025-04-03T16:51:05.72",
        createdBy: "librarian@gmail.com",
        cancelledAt: null,
        cancellationReason: null,
        fineId: null,
        resourceId: null,
        libraryCardPackageId: 1,
        transactionMethod: 0,
        paymentMethodId: null,
        qrCode: null,
        user: {
          userId: "34858b29-7110-f011-929c-346f24123636",
          roleId: 4,
          libraryCardId: "33858b29-7110-f011-929c-346f24123636",
          email: "dawnk1003@gmail.com",
          firstName: "Le Xuan",
          lastName: "Phuoc",
          passwordHash:
            "$2a$13$uL26fMSDh72NPqc6yQDdzucKnLQj1xiXt7S/u6KcS2P71qgkCkLii",
          phone: "0777155781",
          avatar:
            "https://res.cloudinary.com/dchmztiqg/image/upload/v1743673859/dd301a98-08ff-4fcb-bcdf-2b874f6c6378.jpg",
          address: "59",
          gender: "Male",
          dob: "2003-02-10T00:00:00",
          isActive: true,
          isDeleted: false,
          isEmployeeCreated: true,
          createDate: "2025-04-03T16:51:05.72",
          modifiedDate: null,
          modifiedBy: null,
          twoFactorEnabled: false,
          phoneNumberConfirmed: false,
          emailConfirmed: true,
          twoFactorSecretKey: null,
          twoFactorBackupCodes: null,
          phoneVerificationCode: null,
          emailVerificationCode: null,
          phoneVerificationExpiry: null,
          role: null,
          libraryCard: null,
        },
        fine: null,
        libraryResource: null,
        libraryCardPackage: null,
        paymentMethod: null,
        borrowRequestResources: [],
      },
      {
        transactionId: 795,
        transactionCode: "808293642659",
        userId: "381f7eab-830f-f011-929c-346f24123636",
        amount: 438960.0,
        description: null,
        transactionStatus: 2,
        transactionType: 0,
        transactionDate: "2025-04-02T00:00:00",
        expiredAt: null,
        createdAt: "2025-04-02T19:39:00",
        createdBy: null,
        cancelledAt: null,
        cancellationReason: null,
        fineId: null,
        resourceId: null,
        libraryCardPackageId: null,
        transactionMethod: null,
        paymentMethodId: null,
        qrCode: null,
        user: {
          userId: "381f7eab-830f-f011-929c-346f24123636",
          roleId: 4,
          libraryCardId: "371f7eab-830f-f011-929c-346f24123636",
          email: "lexuanphuoc100203@gmail.com",
          firstName: "Le Xuan",
          lastName: "Phuoc",
          passwordHash:
            "$2a$13$hrQIshu97P9lIGpFraEDN.V6cNqnX3y7N79CNivqfEZp332M2Y4Ae",
          phone: "0777155780",
          avatar:
            "https://res.cloudinary.com/dchmztiqg/image/upload/v1743571863/9a7ca064-a979-4924-bc36-1a18664af561.jpg",
          address: "59",
          gender: "Male",
          dob: "2003-02-10T00:00:00",
          isActive: true,
          isDeleted: false,
          isEmployeeCreated: true,
          createDate: "2025-04-02T12:31:03.46",
          modifiedDate: null,
          modifiedBy: null,
          twoFactorEnabled: false,
          phoneNumberConfirmed: false,
          emailConfirmed: true,
          twoFactorSecretKey: null,
          twoFactorBackupCodes: null,
          phoneVerificationCode: null,
          emailVerificationCode: null,
          phoneVerificationExpiry: null,
          role: null,
          libraryCard: null,
        },
        fine: null,
        libraryResource: null,
        libraryCardPackage: null,
        paymentMethod: null,
        borrowRequestResources: [],
      },
    ],
    pageIndex: 1,
    pageSize: 2,
    totalPage: 308,
    totalActualItem: 616,
  },
}

function FinancialSection() {
  const chartData = data.lastYear.map((item, index) => ({
    period: item.periodLabel,
    lastYear: item.count,
    thisYear: data.thisYear[index].count,
  }))

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-2xl font-semibold text-muted-foreground">
        Phân Tích Tài Chính & Giao Dịch
      </h2>

      <div className="mb-6">
        <h3 className="mb-2 text-lg font-medium text-muted-foreground">
          Xu Hướng Doanh Thu
        </h3>
        <LineChart width={600} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="lastYear"
            stroke="#8884d8"
            name="Năm Trước"
          />
          <Line
            type="monotone"
            dataKey="thisYear"
            stroke="#82ca9d"
            name="Năm Nay"
          />
        </LineChart>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          title="Doanh Thu Năm Trước"
          value={data.totalRevenueLastYear.toLocaleString("vi-VN")}
        />
        <StatCard
          title="Doanh Thu Năm Nay"
          value={data.totalRevenueThisYear.toLocaleString("vi-VN")}
        />
      </div>

      <h3 className="mb-2 text-lg font-medium text-muted-foreground">
        Giao Dịch Gần Đây
      </h3>
      <table className="min-w-full rounded-lg shadow-md">
        <thead>
          <tr className="">
            <th className="px-4 py-2 text-left">Mã Giao Dịch</th>
            <th className="px-4 py-2 text-left">Người Dùng</th>
            <th className="px-4 py-2 text-left">Số Tiền</th>
            <th className="px-4 py-2 text-left">Ngày</th>
          </tr>
        </thead>
        <tbody>
          {data.latestTransactions.sources.map((item, index) => (
            <tr key={index} className="border-b">
              <td className="px-4 py-2">{item.transactionCode}</td>
              <td className="px-4 py-2">
                {item.user.firstName} {item.user.lastName}
              </td>
              <td className="px-4 py-2">
                {item.amount.toLocaleString("vi-VN")}
              </td>
              <td className="px-4 py-2">
                {new Date(item.transactionDate).toLocaleDateString("vi-VN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default FinancialSection
