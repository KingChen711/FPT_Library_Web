import "server-only"

import { http } from "@/lib/http"
import { type Author } from "@/lib/types/models"

import { auth } from "../auth"

export type TGetAuthorsData = {
  sources: Author[]
  pageIndex: number
  pageSize: number
  totalPage: number
  count: number
}

export async function getAuthors(query: string): Promise<TGetAuthorsData> {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<TGetAuthorsData>(
      `/api/management/authors?${query}`,
      {
        next: {
          tags: ["authors"],
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
