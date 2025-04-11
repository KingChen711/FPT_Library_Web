/* eslint-disable @typescript-eslint/ban-ts-comment */
import { http } from "@/lib/http"

import "server-only"

import { getBlurDataURL } from "@/lib/server-utils"
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
  blurCoverImage: string | null
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
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        searchParams,
      }
    )

    data.sources = await Promise.all(
      data.sources.map(async (s) => ({
        ...s,
        blurCoverImage: s.coverImage
          ? await getBlurDataURL(s.coverImage)
          : null,
      }))
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
