import { http } from "@/lib/http"

import "server-only"

import {
  type Author,
  type BookEdition,
  type Category,
  type LibraryItemAuthor,
  type Shelf,
} from "@/lib/types/models"
import { type TSearchBooksAdvanceSchema } from "@/lib/validations/books/search-books-advance"

import { auth } from "../auth"

export type BookEditions = (BookEdition & {
  category: Category
  libraryItemAuthors: (LibraryItemAuthor & { author: Author })[]
  shelf: Shelf | null
})[]

export type TResponse = {
  libraryItems: BookEditions
  pageIndex: number
  pageSize: number
  totalPage: number
  totalActualResponse: number
}

const searchBooksAdvance = async (
  searchParams: TSearchBooksAdvanceSchema
): Promise<TResponse> => {
  const { getAccessToken } = auth()
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
