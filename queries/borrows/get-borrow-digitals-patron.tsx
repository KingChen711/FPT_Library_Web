/* eslint-disable @typescript-eslint/ban-ts-comment */
import { http } from "@/lib/http"

import "server-only"

import { format } from "date-fns"

import { type BookResource, type DigitalBorrow } from "@/lib/types/models"
import { type TSearchBorrowDigitalsSchema } from "@/lib/validations/borrows/search-borrow-digital"

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

const getBorrowDigitalsPatron = async (
  searchParams: TSearchBorrowDigitalsSchema
): Promise<TGetDigitalBorrowData> => {
  const { getAccessToken } = auth()

  Object.keys(searchParams.v).forEach((k) => {
    //@ts-ignore
    const value = searchParams.v[k]

    if (value === "null,null") {
      //@ts-ignore
      searchParams.v[k] = ""
    }
  })
  const formatDate = (d: Date) => format(d, "yyyy-MM-dd")

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
        searchParams: {
          registerDateRange:
            JSON.stringify(searchParams.registerDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.registerDateRange.map((d) =>
                  d === null ? "null" : formatDate(new Date(d))
                ),
          expiryDateRange:
            JSON.stringify(searchParams.expiryDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.expiryDateRange.map((d) =>
                  d === null ? "null" : formatDate(new Date(d))
                ),
        },
      }
    )
    return (
      data || {
        sources: [],
        pageIndex: 0,
        pageSize: 0,
        totalActualItem: 0,
        totalPage: 0,
      }
    )
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
