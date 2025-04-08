"use client"

import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

import { http } from "@/lib/http"
import { type EDashboardPeriodLabel } from "@/lib/types/enums"
import {
  type BookEdition,
  type LibraryCard,
  type ReservationQueueManagement,
} from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"

export type TDashboardAssignable = Pagination<
  (ReservationQueueManagement & {
    libraryItem: BookEdition
    libraryCard: LibraryCard
  })[]
>

type AssignableSearchParams = {
  period: EDashboardPeriodLabel
  startDate: Date | null
  endDate: Date | null
  pageSize: string
  pageIndex: number
}

function useDashboardAssignable(searchParams: AssignableSearchParams) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["dashboard/assignable", searchParams, accessToken],
    queryFn: async (): Promise<TDashboardAssignable> => {
      if (!accessToken)
        return {
          pageIndex: 0,
          pageSize: 0,
          sources: [],
          totalActualItem: 0,
          totalPage: 0,
        }
      try {
        const { data } = await http.get<TDashboardAssignable>(
          `/api/management/dashboard/assignable-reservations`,
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

        return (
          data || {
            pageIndex: 0,
            pageSize: 0,
            sources: [],
            totalActualItem: 0,
            totalPage: 0,
          }
        )
      } catch {
        return {
          pageIndex: 0,
          pageSize: 0,
          sources: [],
          totalActualItem: 0,
          totalPage: 0,
        }
      }
    },
    placeholderData: keepPreviousData,
  })
}

export default useDashboardAssignable
