import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

import { http } from "@/lib/http"
import { type EDashboardPeriodLabel } from "@/lib/types/enums"
import { type BookEdition, type Category } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchTopCirculation } from "@/lib/validations/books/search-top-circulation"

export type TDashboardTopCirculation = {
  availableVsNeedChartSummary: {
    availableUnits: number
    needUnits: number
  }
  availableVsNeedChartCategories: {
    category: Category
    totalRequest: number
    totalRequestFailed: number
    totalBorrowed: number
    totalReserved: number
    averageNeedSatisfactionRate: number
    availableUnits: number
    needUnits: number
  }[]
  topBorrowItems: Pagination<
    {
      borrowSuccessCount: number
      borrowFailedCount: number
      reserveCount: number
      extendedBorrowCount: number
      digitalBorrowCount: number
      borrowFailedRate: number
      borrowExtensionRate: number
      libraryItem: BookEdition & { category: Category }
      availableVsNeedChart: {
        averageNeedSatisfactionRate: number
        availableUnits: number
        needUnits: number
      }
      borrowTrends: { periodLabel: string; value: number }[]
      reservationTrends: { periodLabel: string; value: number }[]
    }[]
  >
}

export type TopCirculationSearchParams = {
  period: EDashboardPeriodLabel
  startDate: Date | null
  endDate: Date | null
}

const defaultRes: TDashboardTopCirculation = {
  availableVsNeedChartSummary: {
    availableUnits: 0,
    needUnits: 0,
  },
  availableVsNeedChartCategories: [],
  topBorrowItems: {
    pageIndex: 0,
    pageSize: 0,
    sources: [],
    totalActualItem: 0,
    totalPage: 0,
  },
}

function useDashboardTopCirculation(
  searchParams: TopCirculationSearchParams & TSearchTopCirculation
) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["dashboard/top-circulation", searchParams, accessToken],
    queryFn: async (): Promise<TDashboardTopCirculation> => {
      if (!accessToken) return defaultRes
      try {
        const { data } = await http.get<TDashboardTopCirculation>(
          `/api/management/dashboard/top-circulation-items`,
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

        return data || defaultRes
      } catch {
        return defaultRes
      }
    },
    placeholderData: keepPreviousData,
  })
}

export default useDashboardTopCirculation
