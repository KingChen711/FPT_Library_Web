import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type Transaction } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"

function usePatronTransactions(
  userId: string,
  searchParams: { pageSize: string; pageIndex: number }
) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["transactions", accessToken, userId, searchParams],
    queryFn: async () => {
      try {
        if (!accessToken) throw new Error()

        const { data } = await http.get<Pagination<Transaction[]>>(
          `/api/management/library-card-holders/${userId}/transactions`,
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

export default usePatronTransactions
