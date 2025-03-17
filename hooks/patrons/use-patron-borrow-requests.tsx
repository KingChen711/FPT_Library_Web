/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

import { http } from "@/lib/http"
import { type BorrowRequest } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchBorrowRequestsSchema } from "@/lib/validations/borrows/search-borrow-requests"

function usePatronBorrowRequests(
  userId: string,
  searchParams: TSearchBorrowRequestsSchema
) {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: [
      "management",
      "borrow-requests",
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

        const { data } = await http.get<Pagination<BorrowRequest[]>>(
          `/api/management/library-card-holders/${userId}/borrows/requests`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            searchParams: {
              requestDateRange:
                JSON.stringify(searchParams.requestDateRange) ===
                JSON.stringify([null, null])
                  ? null
                  : searchParams.requestDateRange.map((d) =>
                      d === null ? "null" : formatDate(new Date(d))
                    ),
              expirationDateRange:
                JSON.stringify(searchParams.expirationDateRange) ===
                JSON.stringify([null, null])
                  ? null
                  : searchParams.expirationDateRange.map((d) =>
                      d === null ? "null" : formatDate(new Date(d))
                    ),
              cancelledAtRange:
                JSON.stringify(searchParams.cancelledAtRange) ===
                JSON.stringify([null, null])
                  ? null
                  : searchParams.cancelledAtRange.map((d) =>
                      d === null ? "null" : formatDate(new Date(d))
                    ),
            },
          }
        )

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

export default usePatronBorrowRequests
