import "server-only"

import { format } from "date-fns"

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
  const { getAccessToken } = auth()
  const formatDate = (d: Date) => format(d, "yyyy-MM-dd")
  try {
    const { data } = await http.get<TGetAuthorsData>(
      `/api/management/authors`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        searchParams: {
          ...searchParams,
          dobRange:
            JSON.stringify(searchParams.dobRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.dobRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
          dateOfDeathRange:
            JSON.stringify(searchParams.dateOfDeathRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.dateOfDeathRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
          createDateRange:
            JSON.stringify(searchParams.createDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.createDateRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
          modifiedDateRange:
            JSON.stringify(searchParams.modifiedDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.modifiedDateRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
        },
      }
    )
    return (
      data || {
        pageIndex: 0,
        pageSize: 0,
        sources: [],
        totalActualItem: 0,
        totalPage: 0,
      }
    )
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
