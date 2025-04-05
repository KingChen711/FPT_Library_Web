import "server-only"

import { http } from "@/lib/http"
import { type Condition } from "@/lib/types/models"

import { auth } from "../auth"

export async function getConditions(): Promise<Condition[]> {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<Condition[]>(`/api/management/conditions`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })

    return data
  } catch {
    return []
  }
}
