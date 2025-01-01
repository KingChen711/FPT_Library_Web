import { http } from "@/lib/http"

import "server-only"

import { type BookEdition, type Category } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchBookEditionsSchema } from "@/lib/validations/books/search-book-editions"

import { auth } from "../auth"

export type BookEditions = (BookEdition & {
  categories: Category[]
})[]

const getBookEditions = async (
  searchParams: TSearchBookEditionsSchema
): Promise<Pagination<BookEditions>> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<Pagination<BookEditions>>(
      `/api/management/books/editions`,
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
