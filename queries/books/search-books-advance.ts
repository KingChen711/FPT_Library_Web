/* eslint-disable @typescript-eslint/ban-ts-comment */
import { http } from "@/lib/http"

import "server-only"

import {
  type Author,
  type BookEdition,
  type Category,
  type LibraryItemAuthor,
} from "@/lib/types/models"
import { type TSearchBooksAdvanceSchema } from "@/lib/validations/books/search-books-advance"

import { auth } from "../auth"

// export type BookEditions = (BookEdition & {
//   category: Category
//   libraryItemAuthors: (LibraryItemAuthor & { author: Author })[]
//   shelf: Shelf | null
// })[]

export type TResponse = {
  // libraryItems: BookEditions
  libraryItems: (BookEdition & {
    libraryItemAuthors: (LibraryItemAuthor & { author: Author })[]
    authors: Author[]
    category: Category
  })[]
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
      searchParams: { ...searchParams, isMatchExact: "true" },
    })

    if (!data)
      return {
        libraryItems: [],
        pageIndex: searchParams.pageIndex,
        pageSize: +searchParams.pageSize,
        totalActualResponse: 0,
        totalPage: 0,
      }

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
