import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

import { http } from "@/lib/http"
import {
  type EDashboardPeriodLabel,
  type ETransactionType,
} from "@/lib/types/enums"
import { type Transaction, type User } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"

export type TDashboardFinancial = {
  details: {
    transactionType: ETransactionType
    pendingPercentage: number
    paidPercentage: number
    expiredPercentage: number
    cancelledPercentage: number
    totalRevenueLastYear: number
    totalRevenueThisYear: number
    lastYear: {
      periodLabel: string
      value: number
    }[]

    thisYear: {
      periodLabel: string
      value: number
    }[]
  }[]

  totalRevenueLastYear: number
  totalRevenueThisYear: number
  latestTransactions: Pagination<(Transaction & { user: User })[]>
}

export type FinancialSearchParams = {
  period: EDashboardPeriodLabel
  startDate: Date | null
  endDate: Date | null
  pageSize: string
  pageIndex: number
}

function useDashboardFinancial(searchParams: FinancialSearchParams) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["dashboard/financial", searchParams, accessToken],
    queryFn: async (): Promise<TDashboardFinancial | null> => {
      if (!accessToken) return null
      try {
        const { data } = await http.get<TDashboardFinancial>(
          `/api/management/dashboard/financial-and-transaction-analyst`,
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

export default useDashboardFinancial
