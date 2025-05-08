import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

import { http } from "@/lib/http"
import { type EDashboardPeriodLabel } from "@/lib/types/enums"
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

type CirculationSearchParams = {
  period: EDashboardPeriodLabel
  startDate: Date | null
  endDate: Date | null
}

function useDashboardOverview(searchParams: CirculationSearchParams) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["dashboard/overview", accessToken, searchParams],
    queryFn: async (): Promise<TDashboardOverView | null> => {
      if (!accessToken) return null
      try {
        const { data } = await http.get<TDashboardOverView>(
          `/api/management/dashboard/overview`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            searchParams: {
              ...searchParams,
              startDate: searchParams.startDate
                ? format(searchParams.startDate, "yyyy-MM-dd")
                : "",
              endDate: searchParams.endDate
                ? format(searchParams.endDate, "yyyy-MM-dd")
                : "",
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
