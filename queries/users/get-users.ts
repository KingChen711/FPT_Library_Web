import "server-only"

import { http } from "@/lib/http"
import { type User } from "@/lib/types/models"

import { auth } from "../auth"

export type TGetUSersData = {
  sources: User[]
  pageIndex: number
  pageSize: number
  totalPage: number
  count: number
}

export async function getUsers(query: string): Promise<TGetUSersData> {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<TGetUSersData>(
      `/api/management/users?${query}`,
      {
        next: {
          tags: ["users"],
        },
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )
    return { ...data, count: data.sources.length }
  } catch {
    return {
      sources: [],
      pageIndex: 0,
      pageSize: 0,
      totalPage: 0,
      count: 0,
    }
  }
}
