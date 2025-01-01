import { http } from "@/lib/http"

import "server-only"

import { type Fine } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchFinesSchema } from "@/lib/validations/fines/search-fines"

import { auth } from "../auth"

export type Fines = Fine[]

const getFines = async (
  searchParams: TSearchFinesSchema
): Promise<Pagination<Fines>> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<Pagination<Fines>>(`/api/fines/policy`, {
      next: {
        tags: ["management-fines"],
      },
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

export default getFines
