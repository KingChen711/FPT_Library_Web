// "use client"

// import React, { useState } from "react"
// import {
//   Cell,
//   Legend,
//   Pie,
//   PieChart,
//   ResponsiveContainer,
//   Tooltip,
// } from "recharts"

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// import StatCard from "./stat-card"

// const overview = {
//   totalItemUnits: 85,
//   totalDigitalUnits: 3,
//   totalBorrowingUnits: 3,
//   totalOverdueUnits: 1,
//   totalPatrons: 4,
//   totalInstanceUnits: 49,
//   totalAvailableUnits: 15,
//   totalLostUnits: 0,
// }

// const inventoryStock = {
//   inventoryStockSummary: {
//     totalStockInItem: 83,
//     totalInstanceItem: 340,
//     totalCatalogedItem: 82,
//     totalCatalogedInstanceItem: 35,
//   },
//   inventoryStockCategorySummary: [
//     {
//       category: {
//         categoryId: 1,
//         prefix: "SD",
//         englishName: "SingleBook",
//         vietnameseName: "Sách đơn",
//         description: null,
//         isAllowAITraining: true,
//         totalBorrowDays: 30,
//       },
//       totalStockInItem: 32,
//       totalInstanceItem: 118,
//       totalCatalogedItem: 31,
//       totalCatalogedInstanceItem: 22,
//     },
//     {
//       category: {
//         categoryId: 2,
//         prefix: "SB",
//         englishName: "BookSeries",
//         vietnameseName: "Sách bộ",
//         description: null,
//         isAllowAITraining: true,
//         totalBorrowDays: 30,
//       },
//       totalStockInItem: 47,
//       totalInstanceItem: 209,
//       totalCatalogedItem: 47,
//       totalCatalogedInstanceItem: 13,
//     },
//     {
//       category: {
//         categoryId: 4,
//         prefix: "STK",
//         englishName: "ReferenceBook",
//         vietnameseName: "Sách tham khảo",
//         description: null,
//         isAllowAITraining: true,
//         totalBorrowDays: 90,
//       },
//       totalStockInItem: 3,
//       totalInstanceItem: 12,
//       totalCatalogedItem: 3,
//       totalCatalogedInstanceItem: 0,
//     },
//     {
//       category: {
//         categoryId: 5,
//         prefix: "TC",
//         englishName: "Magazine",
//         vietnameseName: "Tạp chí",
//         description: null,
//         isAllowAITraining: false,
//         totalBorrowDays: 30,
//       },
//       totalStockInItem: 0,
//       totalInstanceItem: 0,
//       totalCatalogedItem: 0,
//       totalCatalogedInstanceItem: 0,
//     },
//     {
//       category: {
//         categoryId: 6,
//         prefix: "BC",
//         englishName: "Newspaper",
//         vietnameseName: "Báo chí",
//         description: null,
//         isAllowAITraining: false,
//         totalBorrowDays: 20,
//       },
//       totalStockInItem: 1,
//       totalInstanceItem: 1,
//       totalCatalogedItem: 1,
//       totalCatalogedInstanceItem: 0,
//     },
//   ],
// }

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

// function OverviewSection() {
//   const [activeChart, setActiveChart] = useState("totalStockInItem")
//   const [viewMode, setViewMode] = useState("summary") // 'summary' 或 'category'

//   // 数据用于饼图 - 统计总览
//   const summaryData = [
//     {
//       name: "Số lượng tài liệu",
//       value: inventoryStock.inventoryStockSummary.totalStockInItem,
//     },
//     {
//       name: "Số lượng bản vật lý",
//       value: inventoryStock.inventoryStockSummary.totalInstanceItem,
//     },
//     {
//       name: "Tài liệu đã biên mục",
//       value: inventoryStock.inventoryStockSummary.totalCatalogedItem,
//     },
//     {
//       name: "Bản sao đã biên mục",
//       value: inventoryStock.inventoryStockSummary.totalCatalogedInstanceItem,
//     },
//   ]

//   // 数据用于饼图 - 按类别统计（以 totalStockInItem 为例）
//   const categoryData = inventoryStock.inventoryStockCategorySummary.map(
//     (item) => ({
//       name: item.category.vietnameseName,
//       value: item.totalStockInItem,
//     })
//   )

//   // 颜色用于饼图

//   const getCategoryData = (key) => {
//     return inventoryStock.inventoryStockCategorySummary
//       .filter((item) => item[key] > 0)
//       .map((item) => ({
//         name: item.category.vietnameseName,
//         value: item[key] as number,
//       }))
//   }

//   return (
//     <div className="mb-8 mt-4">
//       <h2 className="mb-4 text-xl font-semibold text-muted-foreground">
//         Tổng Quan
//       </h2>
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <StatCard title="Số Tài Liệu Cứng" value={overview.totalItemUnits} />
//         <StatCard
//           title="Số Tài Liệu Điện Tử"
//           value={overview.totalDigitalUnits}
//         />
//         <StatCard
//           title="Số Tài Liệu Đang Mượn"
//           value={overview.totalBorrowingUnits}
//         />
//         <StatCard
//           title="Số Tài Liệu Quá Hạn"
//           value={overview.totalOverdueUnits}
//         />
//         <StatCard title="Số Người Dùng" value={overview.totalPatrons} />
//         <StatCard title="Số Bản Vật Lý" value={overview.totalInstanceUnits} />
//         <StatCard
//           title="Số Tài Liệu Sẵn Có"
//           value={overview.totalAvailableUnits}
//         />
//         <StatCard title="Số Tài Liệu Mất" value={overview.totalLostUnits} />
//       </div>

//       {/* Thống kê kho */}
//       <Card className="mx-auto w-full max-w-4xl">
//         <CardHeader>
//           <CardTitle>Thống kê kho tài liệu</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Tabs defaultValue="overview" className="w-full">
//             <TabsList className="grid w-full grid-cols-2">
//               <TabsTrigger value="overview">Tổng quan</TabsTrigger>
//               <TabsTrigger value="categories">Theo danh mục</TabsTrigger>
//             </TabsList>

//             <TabsContent value="overview">
//               <div className="space-y-4">
//                 <div className="flex justify-center gap-4">
//                   {[
//                     "totalStockInItem",
//                     "totalInstanceItem",
//                     "totalCatalogedItem",
//                     "totalCatalogedInstanceItem",
//                   ].map((key) => (
//                     <button
//                       key={key}
//                       className={`rounded px-3 py-1 ${activeChart === key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
//                       onClick={() => setActiveChart(key)}
//                     >
//                       {
//                         summaryData[
//                           [
//                             "totalStockInItem",
//                             "totalInstanceItem",
//                             "totalCatalogedItem",
//                             "totalCatalogedInstanceItem",
//                           ].indexOf(key)
//                         ].name
//                       }
//                     </button>
//                   ))}
//                 </div>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart>
//                     <Pie
//                       data={summaryData}
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={100}
//                       fill="#8884d8"
//                       dataKey="value"
//                       label
//                     >
//                       {summaryData.map((_, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={COLORS[index % COLORS.length]}
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </TabsContent>

//             <TabsContent value="categories">
//               <div className="space-y-4">
//                 <div className="flex justify-center gap-4">
//                   {[
//                     "totalStockInItem",
//                     "totalInstanceItem",
//                     "totalCatalogedItem",
//                     "totalCatalogedInstanceItem",
//                   ].map((key) => (
//                     <button
//                       key={key}
//                       className={`rounded px-3 py-1 ${activeChart === key ? "bg-primary text-primary-foreground" : "bg-muted"}`}
//                       onClick={() => setActiveChart(key)}
//                     >
//                       {
//                         summaryData[
//                           [
//                             "totalStockInItem",
//                             "totalInstanceItem",
//                             "totalCatalogedItem",
//                             "totalCatalogedInstanceItem",
//                           ].indexOf(key)
//                         ].name
//                       }
//                     </button>
//                   ))}
//                 </div>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart>
//                     <Pie
//                       data={getCategoryData(
//                         activeChart as keyof InventoryStockCategorySummary
//                       )}
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={100}
//                       fill="#8884d8"
//                       dataKey="value"
//                       label
//                     >
//                       {getCategoryData(
//                         activeChart as keyof InventoryStockCategorySummary
//                       ).map((_, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={COLORS[index % COLORS.length]}
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

// export default OverviewSection
