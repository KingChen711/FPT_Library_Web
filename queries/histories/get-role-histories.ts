/* eslint-disable @typescript-eslint/ban-ts-comment */
import { http } from "@/lib/http"

import "server-only"

import { type Audit } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchAuditsSchema } from "@/lib/validations/audits/search-audits"

import { auth } from "../auth"

export type RoleHistories = (Audit & {
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

const getRoleHistories = async (
  searchParams: TSearchAuditsSchema
): Promise<Pagination<RoleHistories>> => {
  const { getAccessToken } = auth()

  try {
    const { data } = await http.get<Pagination<RoleHistories>>(
      `/api/management/roles/audits`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
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
}

export default getRoleHistories
