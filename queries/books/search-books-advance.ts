/* eslint-disable @typescript-eslint/ban-ts-comment */
import { http } from "@/lib/http"

import "server-only"

import { type LibraryItem } from "@/lib/types/models"
import { type TSearchBooksAdvanceSchema } from "@/lib/validations/books/search-books-advance"

import { auth } from "../auth"

// export type BookEditions = (BookEdition & {
//   category: Category
//   libraryItemAuthors: (LibraryItemAuthor & { author: Author })[]
//   shelf: Shelf | null
// })[]

export type TResponse = {
  // libraryItems: BookEditions
  libraryItems: LibraryItem[]
  pageIndex: number
  pageSize: number
  totalPage: number
  totalActualResponse: number
}

const searchBooksAdvance = async (
  searchParams: TSearchBooksAdvanceSchema
): Promise<TResponse> => {
  const { getAccessToken } = auth()

  Object.keys(searchParams.v).forEach((k) => {
    //@ts-ignore
    const value = searchParams.v[k]

    if (value === "null,null") {
      //@ts-ignore
      searchParams.v[k] = ""
    }
  })

  try {
    const { data } = await http.get<TResponse>(`/api/library-items/q`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
      searchParams,
    })

    return data
  } catch {
    return {
      libraryItems: [],
      pageIndex: searchParams.pageIndex,
      pageSize: +searchParams.pageSize,
      totalActualResponse: 0,
      totalPage: 0,
    }
  }
}

export default searchBooksAdvance
