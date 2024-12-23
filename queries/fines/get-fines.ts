import { http } from "@/lib/http"

import "server-only"

import { type Fine } from "@/lib/types/models"
import { type TSearchFinesSchema } from "@/lib/validations/fines/search-fine"

import { auth } from "../auth"

export type Fines = Fine[]

const getFines = async (searchParams: TSearchFinesSchema): Promise<Fines> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<Fines>(`/api/fines/policy`, {
      next: {
        tags: ["management-fines"],
      },
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
      searchParams,
    })

    return data || []
  } catch {
    return []
  }
}

export default getFines
