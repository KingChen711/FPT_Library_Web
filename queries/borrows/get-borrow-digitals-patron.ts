/* eslint-disable @typescript-eslint/ban-ts-comment */
import { http } from "@/lib/http"

import "server-only"

import { format } from "date-fns"

import {
  type BookResource,
  type BorrowDigital,
  type LibraryCard,
} from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchBorrowDigitalsManagementSchema } from "@/lib/validations/borrow-digitals-management/search-borrow-digitals-management"

import { auth } from "../auth"

// export type TGetDigitalBorrowData = {
//   sources: (DigitalBorrow & {
//     libraryResource: BookResource
//     transactions: unknown[]
//   })[]
//   pageIndex: number
//   pageSize: number
//   totalPage: number
//   totalActualItem: number
// }

export type BorrowDigitals = (BorrowDigital & {
  libraryResource: BookResource
  librarycard: LibraryCard
})[]

const getBorrowDigitalsPatron = async (
  searchParams: TSearchBorrowDigitalsManagementSchema
): Promise<Pagination<BorrowDigitals>> => {
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
    const { data } = await http.get<Pagination<BorrowDigitals>>(
      `/api/users/borrows/digital`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        searchParams: {
          ...searchParams,
          registerDateRange:
            JSON.stringify(searchParams.registerDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.registerDateRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
          expiryDateRange:
            JSON.stringify(searchParams.expiryDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.expiryDateRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
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
