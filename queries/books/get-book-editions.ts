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
import { type TSearchBookEditionsSchema } from "@/lib/validations/books/search-book-editions"

import { auth } from "../auth"

export type BookEditions = (BookEdition & {
  category: Category
  libraryItemAuthors: (LibraryItemAuthor & { author: Author })[]
  shelf: Shelf | null
})[]

const getBookEditions = async (
  searchParams: TSearchBookEditionsSchema
): Promise<Pagination<BookEditions>> => {
  const { getAccessToken } = auth()
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
