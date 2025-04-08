"use client"

import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

import { http } from "@/lib/http"
import { type EDashboardPeriodLabel } from "@/lib/types/enums"
import {
  type BookEdition,
  type BorrowRecordDetail,
  type LibraryCard,
  type LibraryItemInstance,
} from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"

export type TDashboardLatestBorrow = Pagination<
  {
    borrowRecordDetail: BorrowRecordDetail & {
      libraryItemInstance: LibraryItemInstance
    }
    libraryItem: BookEdition
    libraryCard: LibraryCard
  }[]
>

type LatestBorrowSearchParams = {
  period: EDashboardPeriodLabel
  startDate: Date | null
  endDate: Date | null
  pageSize: string
  pageIndex: number
}

function useLatestBorrowBorrows(searchParams: LatestBorrowSearchParams) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["dashboard/latest-borrow", searchParams, accessToken],
    queryFn: async (): Promise<TDashboardLatestBorrow> => {
      if (!accessToken)
        return {
          pageIndex: 0,
          pageSize: 0,
          sources: [],
          totalActualItem: 0,
          totalPage: 0,
        }
      try {
        const { data } = await http.get<TDashboardLatestBorrow>(
          `/api/management/dashboard/latest-borrows`,
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

export default useLatestBorrowBorrows
