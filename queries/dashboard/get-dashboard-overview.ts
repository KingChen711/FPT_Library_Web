import "server-only"

import { http } from "@/lib/http"
import { type Category } from "@/lib/types/models"

import { auth } from "../auth"

type TDashboardOverView = {
  dashboardOverView: {
    totalItemUnits: number
    totalDigitalUnits: number
    totalBorrowingUnits: number
    totalOverdueUnits: number
    totalPatrons: number
    totalInstanceUnits: number
    totalAvailableUnits: number
    totalLostUnits: number
  }
  dashboardInventoryAndStock: {
    inventoryStockSummary: {
      totalStockInItem: number
      totalInstanceItem: number
      totalCatalogedItem: number
      totalCatalogedInstanceItem: number
    }
  }
  inventoryStockCategorySummary: {
    category: Category
    totalStockInItem: number
    totalInstanceItem: number
    totalCatalogedItem: number
    totalCatalogedInstanceItem: number
  }[]
}

export async function getDashboardOverview(): Promise<TDashboardOverView | null> {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<TDashboardOverView>(
      `/api/management/dashboard/overview`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    return data || null
  } catch {
    return null
  }
}
