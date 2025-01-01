import { http } from "@/lib/http"

import "server-only"

import {
  type Author,
  type BookEdition,
  type BookEditionCopy,
  type BookEditionInventory,
} from "@/lib/types/models"

import { auth } from "../auth"

//TODO: fix another created date field name problem
type BookEditionDetail = BookEdition & {
  bookEditionInventory: BookEditionInventory
  authors: Author[]
  bookEditionCopies: BookEditionCopy[]
}

const getBookEdition = async (
  id: number
): Promise<BookEditionDetail | null> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<BookEditionDetail>(
      `/api/management/books/editions/${id}`,
      {
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
