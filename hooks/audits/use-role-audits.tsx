"use client"

import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type Audit } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchAuditsSchema } from "@/lib/validations/audits/search-audits"

function useRoleAudits(searchParams: TSearchAuditsSchema) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["audits", searchParams, accessToken],
    queryFn: async () => {
      if (!accessToken)
        return {
          sources: [],
          pageIndex: searchParams.pageIndex,
          pageSize: +searchParams.pageSize,
          totalActualItem: 0,
          totalPage: 0,
        }
      try {
        const { data } = await http.get<Pagination<Audit[]>>(
          `/api/management/roles/audits`,
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

export default useRoleAudits
