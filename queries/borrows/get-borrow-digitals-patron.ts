import { http } from "@/lib/http"

import "server-only"

import { type BookResource, type DigitalBorrow } from "@/lib/types/models"

import { auth } from "../auth"

export type TGetDigitalBorrowData = {
  sources: (DigitalBorrow & {
    libraryResource: BookResource
    transactions: unknown[]
  })[]
  pageIndex: number
  pageSize: number
  totalPage: number
  totalActualItem: number
}

const getBorrowDigitalsPatron = async (): Promise<TGetDigitalBorrowData> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<TGetDigitalBorrowData>(
      `/api/users/borrows/digital`,
      {
        next: {
          tags: ["/borrows/digital", getAccessToken()!],
        },
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )
    return data
  } catch {
    return {
      sources: [],
      pageIndex: 0,
      pageSize: 0,
      totalPage: 0,
      totalActualItem: 0,
    }
  }
}

export default getBorrowDigitalsPatron
