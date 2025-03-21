/* eslint-disable @typescript-eslint/ban-ts-comment */
import { http } from "@/lib/http"

import "server-only"

import {
  type Author,
  type BookEdition,
  type Category,
  type LibraryItemAuthor,
  type Shelf,
} from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchBooksAdvanceSchema } from "@/lib/validations/books/search-books-advance"

import { auth } from "../auth"

export type BookEditions = (BookEdition & {
  category: Category
  libraryItemAuthors: (LibraryItemAuthor & { author: Author })[]
  shelf: Shelf | null
})[]

const getBookEditions = async (
  searchParams: TSearchBooksAdvanceSchema
): Promise<Pagination<BookEditions>> => {
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
    const { data } = await http.get<Pagination<BookEditions>>(
      `/api/management/library-items`,
      {
        next: {
          tags: ["management-book-editions"],
        },
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
      pageIndex: searchParams.pageIndex,
      pageSize: +searchParams.pageSize,
      totalActualItem: 0,
      totalPage: 0,
    }
  }
}

export default getBookEditions
