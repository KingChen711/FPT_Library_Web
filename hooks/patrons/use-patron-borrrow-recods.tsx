/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

import { http } from "@/lib/http"
import { type BorrowRecord } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchBorrowRecordsSchema } from "@/lib/validations/borrow-records/search-borrow-records"

function usePatronBorrowRecords(
  userId: string,
  searchParams: TSearchBorrowRecordsSchema
) {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: [
      "management",
      "borrow-records",
      accessToken,
      userId,
      searchParams,
    ],
    queryFn: async () => {
      Object.keys(searchParams.v).forEach((k) => {
        //@ts-ignore
        const value = searchParams.v[k]

        if (value === "null,null") {
          //@ts-ignore
          searchParams.v[k] = ""
        }
      })
      const formatDate = (d: Date) => format(d, "yyyy-MM-dd")
      try {
        if (!accessToken) throw new Error()

        const { data } = await http.get<
          Pagination<
            (BorrowRecord & { processedByNavigation: { email: string } })[]
          >
        >(`/api/management/library-card-holders/${userId}/borrows/records`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          searchParams: {
            ...searchParams,
            borrowDateRange:
              JSON.stringify(searchParams.borrowDateRange) ===
              JSON.stringify([null, null])
                ? null
                : searchParams.borrowDateRange.map((d) =>
                    d === null ? "" : formatDate(new Date(d))
                  ),
          },
        })

        return data
      } catch {
        return {
          sources: [],
          pageIndex: searchParams.pageIndex,
          pageSize: +searchParams.pageSize,
          totalActualItem: 0,
          totalPage: 0,
        }
      }
    },
    placeholderData: keepPreviousData,
  })
}

export default usePatronBorrowRecords
