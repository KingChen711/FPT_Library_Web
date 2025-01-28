import { http } from "@/lib/http"

import "server-only"

import {
  type Author,
  type BookEdition,
  type LibraryItemInstance,
  type LibraryItemInventory,
} from "@/lib/types/models"

import { auth } from "../auth"

//TODO: fix another created date field name problem
export type BookEditionDetail = BookEdition & {
  bookEditionInventory: LibraryItemInventory
  authors: Author[]
  bookEditionCopies: LibraryItemInstance[]
}

const getBookEdition = async (
  id: number
): Promise<BookEditionDetail | null> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<BookEditionDetail>(
      `/api/management/books/editions/${id}`,
      {
        next: {
          tags: ["management-book-editions"],
        },
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    return data || null
  } catch {
    return null
  }
}

export default getBookEdition
