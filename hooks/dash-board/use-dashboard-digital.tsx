import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

import { http } from "@/lib/http"
import { type EDashboardPeriodLabel } from "@/lib/types/enums"
import { type BookResource } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"

export type TDashboardDigital = {
  totalDigitalResource: number
  totalActiveDigitalBorrowing: number
  extensionRatePercentage: number
  averageExtensionsPerBorrow: number
  topBorrowLibraryResources: Pagination<
    {
      libraryResource: BookResource
      totalBorrowed: number
      totalExtension: number
      averageBorrowDuration: number
      extensionRate: number
      lastBorrowDate: Date | null
    }[]
  >
}

export type DigitalSearchParams = {
  period: EDashboardPeriodLabel
  startDate: Date | null
  endDate: Date | null
  pageSize: string
  pageIndex: number
}

function useDashboardDigital(searchParams: DigitalSearchParams) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["dashboard/digital", searchParams, accessToken],
    queryFn: async (): Promise<TDashboardDigital | null> => {
      if (!accessToken) return null
      try {
        const { data } = await http.get<TDashboardDigital>(
          `/api/management/dashboard/digital-resource-analyst`,
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

export default useDashboardDigital
