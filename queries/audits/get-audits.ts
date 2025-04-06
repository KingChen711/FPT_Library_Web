import { http } from "@/lib/http"

import "server-only"

import { type Audit } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchAuditsSchema } from "@/lib/validations/audits/search-audits"

import { auth } from "../auth"

export type Audits = Audit[]

const getAudits = async (
  searchParams: TSearchAuditsSchema
): Promise<Pagination<Audits>> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<Pagination<Audits>>(`/api/audits/policy`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
      searchParams,
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
}

export default getAudits
