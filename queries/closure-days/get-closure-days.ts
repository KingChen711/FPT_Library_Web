import { http } from "@/lib/http"

import "server-only"

import { type ClosureDay } from "@/lib/types/models"

import { auth } from "../auth"

type ClosureDays = ClosureDay[]

const getClosureDays = async (search: string): Promise<ClosureDays> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<ClosureDays>(
      `/api/management/closure-days`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        searchParams: {
          search: search || null,
        },
      }
    )

    return data || []
  } catch {
    return []
  }
}

export default getClosureDays
