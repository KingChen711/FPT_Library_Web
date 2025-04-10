/* eslint-disable @typescript-eslint/ban-ts-comment */
import { http } from "@/lib/http"

import "server-only"

import { type Author, type LibraryItem } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchRecommendSchema } from "@/lib/validations/books/search-recommend-schema"

import { auth } from "../auth"

type Response = Pagination<
  (LibraryItem & { libraryItemAuthors: { author: Author }[] })[]
>

const getRecommendBooks = async (
  searchParams: TSearchRecommendSchema
): Promise<Response> => {
  const { getAccessToken } = auth()

  try {
    const { data } = await http.get<Response>(`/api/recommend`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
      searchParams: {
        ...searchParams,
        pageSize: "12",
      },
    })

    if (!data) throw new Error("")

    return {
      ...data,

      sources: data.sources.map((s) => ({
        ...s,
        authors: s.libraryItemAuthors.map((l) => l.author),
      })),
    }
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

export default getRecommendBooks
