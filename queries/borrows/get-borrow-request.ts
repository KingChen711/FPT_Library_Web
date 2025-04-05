/* eslint-disable @typescript-eslint/ban-ts-comment */
import { http } from "@/lib/http"

import "server-only"

import {
  type Author,
  type BookEdition,
  type BorrowRequestManagement,
  type Category,
  type LibraryCard,
  type Shelf,
} from "@/lib/types/models"

import { auth } from "../auth"

export type BorrowRequestDetailItem = BorrowRequestManagement & {
  libraryCard: LibraryCard
  libraryItems: (BookEdition & {
    shelf: Shelf | null
    category: Category
    authors: Author[]
  })[]
}

const getBorrowRequest = async (
  borrowRequestId: number
): Promise<BorrowRequestDetailItem | null> => {
  const { getAccessToken } = auth()

  try {
    const { data } = await http.get<BorrowRequestDetailItem>(
      `/api/management/borrows/requests/${borrowRequestId}`,
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

export default getBorrowRequest
