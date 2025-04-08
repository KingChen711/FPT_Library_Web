import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

import { http } from "@/lib/http"
import { type EDashboardPeriodLabel } from "@/lib/types/enums"
import { type Category } from "@/lib/types/models"

export type TDashboardCirculation = {
  totalRequestUnits: number
  totalReservedUnits: number
  totalBorrowFailed: number
  borrowFailedRates: number
  totalOverdue: number
  overdueRates: number
  totalLost: number
  lostRates: number
  borrowTrends: {
    periodLabel: string
    value: number
  }[]
  returnTrends: {
    periodLabel: string
    value: number
  }[]
  categoryBorrowFailedSummary: {
    category: Category
    totalBorrowFailed: number
    borrowFailedRates: number
  }[]
  categoryOverdueSummary: {
    category: Category
    totalOverdue: number
    overdueRates: number
  }[]
}

export type CirculationSearchParams = {
  period: EDashboardPeriodLabel
  startDate: Date | null
  endDate: Date | null
}

function useDashboardCirculation(searchParams: CirculationSearchParams) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["dashboard/circulation", searchParams, accessToken],
    queryFn: async (): Promise<TDashboardCirculation | null> => {
      if (!accessToken) return null
      try {
        const { data } = await http.get<TDashboardCirculation>(
          `/api/management/dashboard/circulation-analyst`,
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

export default useDashboardCirculation
