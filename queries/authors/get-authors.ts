import "server-only"

import { http } from "@/lib/http"
import { type Author } from "@/lib/types/models"
import { type TSearchAuthorSchema } from "@/lib/validations/author/search-author"

import { auth } from "../auth"

export type TGetAuthorsData = {
  sources: Author[]
  pageIndex: number
  pageSize: number
  totalPage: number
  totalActualItem: number
}

export async function getAuthors(
  searchParams: TSearchAuthorSchema
): Promise<TGetAuthorsData> {
  console.log("🚀 ~ searchParams:", searchParams)
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<TGetAuthorsData>(
      `/api/management/authors`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        searchParams,
      }
    )
    return data
  } catch {
    return {
      sources: [],
      pageIndex: 0,
      pageSize: 0,
      totalPage: 0,
      totalActualItem: 0,
    }
  }
}
