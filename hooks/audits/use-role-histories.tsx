"use client"

import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type Audit } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchAuditsSchema } from "@/lib/validations/audits/search-audits"

type RoleHistories = (Audit & {
  newValues: {
    EnglishName?: string
    RoleType?: string
    VietnameseName?: string
  }
  oldValues: {
    EnglishName?: string
    RoleType?: string
    VietnameseName?: string
  }
})[]

function useRoleHistories(searchParams: TSearchAuditsSchema) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["audits", searchParams, accessToken],
    queryFn: async (): Promise<Pagination<RoleHistories>> => {
      if (!accessToken)
        return {
          sources: [],
          pageIndex: searchParams.pageIndex,
          pageSize: +searchParams.pageSize,
          totalActualItem: 0,
          totalPage: 0,
        }
      try {
        const { data } = await http.get<Pagination<RoleHistories>>(
          `/api/management/roles/audits`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            searchParams: {
              ...searchParams,
              entityName: "SystemRole",
            },
          }
        )

        return (
          data || {
            sources: [],
            pageIndex: 0,
            pageSize: 0,
            totalActualItem: 0,
            totalPage: 0,
          }
        )
      } catch {
        return {
          sources: [],
          pageIndex: 0,
          pageSize: 0,
          totalActualItem: 0,
          totalPage: 0,
        }
      }
    },
    placeholderData: keepPreviousData,
  })
}

export default useRoleHistories
