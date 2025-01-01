import { http } from "@/lib/http"

import "server-only"

import {
  type Author,
  type Book,
  type BookEdition,
  type BookEditionInventory,
  type BookResource,
  type Category,
} from "@/lib/types/models"

import { auth } from "../auth"

//TODO: fix another created date field name problem
type BookDetail = Book & {
  categories: Category[]
  bookEditions: (BookEdition & {
    bookEditionInventory?: BookEditionInventory
    totalCopies: undefined
    availableCopies: undefined
    requestCopies: undefined
    reservedCopies: undefined
    authors: Author[]
  })[]
  bookResources: BookResource[]
}

const getBook = async (id: number): Promise<BookDetail | null> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<BookDetail>(`/api/management/books/${id}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })

    return data || null
  } catch {
    return null
  }
}

export default getBook
