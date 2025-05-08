/* eslint-disable @typescript-eslint/no-explicit-any */

import { type TTrackingDetail } from "@/queries/trackings/get-tracking"
import { type TTrackingDetailItems } from "@/queries/trackings/get-tracking-details"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

import { type TAIRecommends } from "@/hooks/trackings/use-ai-recommends"

import { vfs } from "./vietnamese-fonts"

// Props của component
interface InventoryReportPDFProps {
  tracking: TTrackingDetail
  trackingDetails: TTrackingDetailItems["result"]["sources"]
  statistics: TTrackingDetailItems["statistics"]
  statisticSummary: TTrackingDetailItems["statisticSummary"]
  supplementRequest: boolean
  recommendItems: TAIRecommends
}

const formatCurrency = (value: number | null): string => {
  if (value === null || value === undefined) return ""
  return value.toLocaleString("vi-VN") + "đ"
}

// Hàm để chuyển Date string -> dd/mm/yyyy
const formatDate = (dateString: string | Date | null): string => {
  if (!dateString) return ""
  const date = new Date(dateString)
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export const generatePDF = ({
  statistics,
  tracking,
  trackingDetails,
  statisticSummary,
  supplementRequest,
  recommendItems,
}: InventoryReportPDFProps): { pdf: Blob; url: string } => {
  // 1. Khởi tạo đối tượng jsPDF
  const doc = new jsPDF({
    unit: "pt", // Dùng pt để tính toán vị trí dễ dàng hơn
    format: "a4", // Kích thước A4
  })

  // 2. Thiết lập font chữ (mặc định là Helvetica)
  doc.addFileToVFS("Roboto-Regular.ttf", vfs["Roboto-Regular.ttf"])
  doc.addFont("Roboto-Regular.ttf", "Roboto", "normal")
  doc.addFileToVFS("Roboto-Bold.ttf", vfs["Roboto-Bold.ttf"])
  doc.addFont("Roboto-Bold.ttf", "Roboto", "bold")
  doc.setFont("Roboto", "normal")
  doc.setFontSize(12)

  // 3. Thêm tiêu đề đầu trang (header)
  // -- Bên trái
  doc.text("Intelligent Library System", 40, 40)
  doc.setFontSize(10)
  doc.text("Hệ thống thư viện thông minh", 40, 55)

  // -- Bên phải
  doc.setFontSize(12)
  doc.text("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", 330, 40)
  doc.setFontSize(10)
  doc.text("Độc lập - Tự do - Hạnh phúc", 380, 55)

  // Vẽ dòng kẻ (mô phỏng như trong hình)
  doc.setLineWidth(0.5)
  doc.line(40, 58, 190, 58) // gạch ngang dưới "PHÒNG GIÁO DỤC TƯ VẤN"
  doc.line(345, 58, 545, 58) // gạch ngang dưới "Độc lập - Tự do - Hạnh phúc"

  // 4. Tiêu đề chính
  doc.setFontSize(14)
  doc.setFont("Roboto", "bold")
  doc.text(
    supplementRequest ? "PHIẾU YÊU CẦU BỔ SUNG" : "PHIẾU NHẬP KHO",
    300,
    90,
    { align: "center" }
  )

  // 5. Ngày tháng
  doc.setFontSize(11)
  doc.setFont("Roboto", "normal")

  // 6. Thông tin chung (supplier, số phiếu, etc.)
  const { receiptNumber, entryDate, supplier, createdBy } = tracking
  const supplierName = supplier?.supplierName || ""
  const supplierContact = supplier?.contactPerson || ""
  const supplierPhone = supplier?.contactPhone || ""
  const entryDateStr = formatDate(entryDate)
  // doc.text(`Nhà cung cấp: ${supplierName}`, 40, 140)
  // doc.text(`Người liên hệ: ${supplierContact}`, 40, 155)

  doc.text(
    `${supplementRequest ? "Số phiếu yêu cầu bổ sung" : "Số phiếu nhập"}: ${receiptNumber || ""}`,
    40,
    125
  )
  doc.text(`Thủ thư trưởng: ${createdBy || ""}`, 40, 140)
  doc.text(
    `${supplementRequest ? "Ngày yêu cầu bổ sung" : "Ngày nhập"}: ${entryDateStr}`,
    40,
    155
  )

  if (!supplementRequest) {
    const pageWidth = doc.internal.pageSize.getWidth()
    const supplierNameText = `Nhà cung cấp: ${supplierName}`
    const supplierContactText = `Người liên hệ: ${supplierContact}`
    const supplierPhoneText = `Số điện thoại: ${supplierPhone}`
    const x = Math.min(
      pageWidth - doc.getTextWidth(supplierNameText) - 40,
      pageWidth - doc.getTextWidth(supplierContactText) - 40,
      pageWidth - doc.getTextWidth(supplierPhoneText) - 40
    )
    doc.text(supplierNameText, x, 125)
    doc.text(supplierContactText, x, 140)
    doc.text(supplierPhoneText, x, 155)
  }

  doc.setFontSize(12)
  doc.setFont("Roboto", "bold")
  doc.text(
    supplementRequest
      ? "Danh sách yêu cầu bổ sung chi tiết"
      : "Danh sách nhập kho chi tiết",
    supplementRequest ? 205 : 225,
    185
  )
  doc.setFont("Roboto", "normal")

  const itemRowsByCategory: Record<string, (string | number)[][]> = {}

  let totalItem = 0

  trackingDetails.forEach((item, index) => {
    const row = [
      index + 1,
      item.itemName,
      item.isbn || "-",
      item.itemTotal,
      formatCurrency(item.unitPrice),
      formatCurrency(item.totalAmount),
    ]

    if (!supplementRequest) {
      row.push(`${item.barcodeRangeFrom}-${item.barcodeRangeTo}`)
    } else {
      row.push(item?.supplementRequestReason || "-")
    }

    itemRowsByCategory[item.category.vietnameseName] = itemRowsByCategory[
      item.category.vietnameseName
    ]
      ? [...itemRowsByCategory[item.category.vietnameseName], row]
      : [row]
  })

  // Định nghĩa các cột (sử dụng header là mảng string)
  const itemColumns = ["STT", "Tên sách", "ISBN", "SL", "Đơn giá", "Thành tiền"]

  if (!supplementRequest) {
    itemColumns.push("Số ĐKCB")
  } else {
    itemColumns.push("Lý do bổ sung")
  }

  let finalY = 205 // Ép kiểu vì lastAutoTable không được định nghĩa sẵn trong jsPDF

  Object.entries(itemRowsByCategory).forEach(([key, value], i) => {
    // Sử dụng autoTable
    if (i > 0) {
      finalY = (doc as any).lastAutoTable.finalY + 30
    }
    doc.setFontSize(14)
    doc.setFont("Roboto", "bold")
    doc.text(key, 40, finalY)
    doc.setFont("Roboto", "normal")
    autoTable(doc, {
      head: [itemColumns],
      body: value,
      startY: finalY + 10,
      margin: { left: 40, right: 40 },
      styles: { fontSize: 10, cellPadding: 4, font: "Roboto" },
      headStyles: { fillColor: [242, 242, 242], textColor: [0, 0, 0] },
    })
  })

  // 8. Bảng thống kê theo loại (statistics)
  finalY = (doc as any).lastAutoTable.finalY + 30 // Ép kiểu vì lastAutoTable không được định nghĩa sẵn trong jsPDF

  const statisticsRows = statistics
    .map((stat, idx) => {
      if (stat.totalItem === null || stat.totalItem === undefined) return false
      const categoryName = stat?.category?.vietnameseName || ""
      totalItem += stat.totalItem ?? 0
      return supplementRequest
        ? [
            idx + 1,
            categoryName,
            stat.totalItem ?? 0,
            stat.totalInstanceItem ?? 0,
            formatCurrency(stat.totalPrice),
          ]
        : [
            idx + 1,
            categoryName,
            stat.totalItem ?? 0,
            stat.totalInstanceItem ?? 0,
            stat.totalCatalogedItem ?? 0,
            stat.totalCatalogedInstanceItem ?? 0,
            formatCurrency(stat.totalPrice),
          ]
    })
    .filter(Boolean) as (string | number)[][]

  doc.setFontSize(14)
  doc.setFont("Roboto", "bold")
  doc.text("Thống kê theo loại", 40, finalY)
  doc.setFont("Roboto", "normal")

  const headCategory = supplementRequest
    ? [["STT", "Loại", "Tổng tài liệu", "Tổng bản sao", "Tổng tiền"]]
    : [
        [
          "STT",
          "Loại",
          "Tổng tài liệu",
          "Tổng bản sao",
          "Tổng tài liệu đã biên mục",
          "Tổng bản sao đã dán ĐKCB",
          "Tổng tiền",
        ],
      ]

  autoTable(doc, {
    head: headCategory,
    body: statisticsRows,
    startY: finalY + 10,
    margin: { left: 40, right: 40 },
    styles: { fontSize: 10, cellPadding: 4, font: "Roboto" },
    headStyles: { fillColor: [242, 242, 242], textColor: [0, 0, 0] },
  })

  if (supplementRequest) {
    finalY = (doc as any).lastAutoTable.finalY + 30

    doc.setFontSize(14)
    doc.setFont("Roboto", "bold")
    doc.text("Đề xuất bổ sung", 40, finalY)
    doc.setFont("Roboto", "normal")

    const recommendRows = recommendItems.sources.map((stat, idx) => {
      return [
        idx + 1,
        stat.title,
        stat.author,
        stat.publisher,
        stat.publishedDate,
        stat.isbn,
        stat.pageCount,
        stat.language,
        stat.categories,
        stat.supplementRequestReason,
      ]
    })

    autoTable(doc, {
      head: [
        [
          "STT",
          "Tiêu đề",
          "Tác giả",
          "Nhà xuất bản",
          "Năm xuất bản",
          "ISBN",
          "Số trang",
          "Ngôn ngữ",
          "Thể loại",
          "Lý do bổ sung",
        ],
      ],
      body: recommendRows,
      startY: finalY + 10,
      margin: { left: 40, right: 40 },
      styles: { fontSize: 10, cellPadding: 4, font: "Roboto" },
      headStyles: { fillColor: [242, 242, 242], textColor: [0, 0, 0] },
    })
  }

  finalY = (doc as any).lastAutoTable.finalY + 30
  let totalMoney = 0
  statistics.forEach((s) => {
    totalMoney += Number(s.totalPrice) || 0
  })
  doc.setFontSize(14)
  doc.setFont("Roboto", "bold")
  doc.text("Thống kê chung", 40, finalY)
  doc.setFont("Roboto", "normal")

  const head = supplementRequest
    ? [["Tổng tài liệu", "Tổng tiền"]]
    : [
        [
          "Tổng tài liệu",
          "Tổng bản sao",
          "Tổng tài liệu đã biên mục",
          "Tổng bản sao đã dán ĐKCB",
          "Tổng tiền",
        ],
      ]

  const body = supplementRequest
    ? [[totalItem, formatCurrency(totalMoney)]]
    : [
        [
          statisticSummary.totalItem,
          statisticSummary.totalInstanceItem,
          statisticSummary.totalCatalogedItem,
          statisticSummary.totalCatalogedInstanceItem,
          formatCurrency(totalMoney),
        ],
      ]

  autoTable(doc, {
    head,
    body,
    startY: finalY + 10,
    margin: { left: 40, right: 40 },
    styles: { fontSize: 10, cellPadding: 4, font: "Roboto" },
    headStyles: { fillColor: [242, 242, 242], textColor: [0, 0, 0] },
  })

  // 9. Ghi chú
  finalY = (doc as any).lastAutoTable.finalY + 25
  doc.setFontSize(11)
  doc.text(
    "Ghi chú: Báo cáo này chỉ mang tính tham khảo, có thể điều chỉnh tùy theo kho thực tế.",
    40,
    finalY
  )
  doc.setFontSize(10)

  // 10. Chữ ký
  // finalY += 60
  // doc.setFontSize(11)
  // doc.setFont("Roboto", "bold")
  // doc.text("Người lập", 70, finalY, { align: "center" })
  // doc.text("Kế toán", 270, finalY, { align: "center" })
  // doc.text("Thủ trưởng đơn vị", 430, finalY, { align: "center" })

  // 11. Xuất PDF và mở tab mới
  const pdf = doc.output("blob")
  const url = URL.createObjectURL(pdf)

  return { pdf, url }
}
