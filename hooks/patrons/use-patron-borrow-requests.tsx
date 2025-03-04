import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type BorrowRequest } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchBorrowRequestsSchema } from "@/lib/validations/patrons/cards/search-borrow-requests"

function usePatronBorrowRequests(
  userId: string,
  searchParams: TSearchBorrowRequestsSchema
) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["borrow-requests", accessToken, userId, searchParams],
    queryFn: async () => {
      try {
        if (!accessToken) throw new Error()

        const { data } = await http.get<Pagination<BorrowRequest[]>>(
          `/api/management/library-card-holders/${userId}/borrows/requests`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            searchParams,
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
