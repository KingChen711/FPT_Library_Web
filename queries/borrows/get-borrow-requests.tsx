/* eslint-disable @typescript-eslint/ban-ts-comment */
import { http } from "@/lib/http"

import "server-only"

import { format } from "date-fns"

import { type BorrowRequest, type LibraryCard } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchBorrowRequestsSchema } from "@/lib/validations/borrows/search-borrow-requests"

import { auth } from "../auth"

export type BorrowRequests = (BorrowRequest & {
  libraryCard: LibraryCard
})[]

const getBorrowRequests = async (
  searchParams: TSearchBorrowRequestsSchema
): Promise<Pagination<BorrowRequests>> => {
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
    const { data } = await http.get<Pagination<BorrowRequests>>(
      `/api/management/borrows/requests`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        searchParams: {
          requestDateRange:
            JSON.stringify(searchParams.requestDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.requestDateRange.map((d) =>
                  d === null ? "null" : formatDate(new Date(d))
                ),
          expirationDateRange:
            JSON.stringify(searchParams.expirationDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.expirationDateRange.map((d) =>
                  d === null ? "null" : formatDate(new Date(d))
                ),
          cancelledAtRange:
            JSON.stringify(searchParams.cancelledAtRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.cancelledAtRange.map((d) =>
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
      totalActualItem: 0,
      totalPage: 0,
    }
  }
}

export default getBorrowRequests
