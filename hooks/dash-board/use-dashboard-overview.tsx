import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type Category } from "@/lib/types/models"

export type TDashboardOverView = {
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
    inventoryStockCategorySummary: {
      category: Category
      totalStockInItem: number
      totalInstanceItem: number
      totalCatalogedItem: number
      totalCatalogedInstanceItem: number
    }[]
  }
}

function useDashboardOverview() {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["dashboard/overview", accessToken],
    queryFn: async (): Promise<TDashboardOverView | null> => {
      if (!accessToken) return null
      try {
        const { data } = await http.get<TDashboardOverView>(
          `/api/management/dashboard/overview`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        return data || null
      } catch {
        return null
      }
    },
    placeholderData: keepPreviousData,
  })
}

export default useDashboardOverview
