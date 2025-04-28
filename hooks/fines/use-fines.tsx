import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type Fine } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"

function useFines(searchParams: { pageSize: string; pageIndex: number }) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["fines", accessToken, searchParams],
    queryFn: async () => {
      try {
        if (!accessToken)
          return {
            sources: [],
            pageIndex: searchParams.pageIndex,
            pageSize: +searchParams.pageSize,
            totalActualItem: 0,
            totalPage: 0,
          }

        const { data } = await http.get<Pagination<Fine[]>>(
          `/api/fines/policy`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            searchParams: {
              ...searchParams,
              sort: "-ConditionType",
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
    refetchOnWindowFocus: false,
  })
}

export default useFines
