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

export type BorrowDigitals = (BorrowDigital & {
  libraryResource: BookResource
  librarycard: LibraryCard
})[]

const getBorrowDigitals = async (
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

  try {
    const formatDate = (d: Date) => format(d, "yyyy-MM-dd")

    const { data } = await http.get<Pagination<BorrowDigitals>>(
      `/api/management/borrows/digital`,
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
        pageIndex: 0,
        pageSize: 0,
        sources: [],
        totalActualItem: 0,
        totalPage: 0,
      }
    )
  } catch (error) {
    console.log(error)

    return {
      pageIndex: 0,
      pageSize: 0,
      sources: [],
      totalActualItem: 0,
      totalPage: 0,
    }
  }
}

export default getBorrowDigitals
