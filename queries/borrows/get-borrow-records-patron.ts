/* eslint-disable @typescript-eslint/ban-ts-comment */
import { http } from "@/lib/http"

import "server-only"

import { format } from "date-fns"

import {
  type BorrowRecord,
  type BorrowRequestManagement,
  type Employee,
  type LibraryCard,
} from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchBorrowRecordsSchema } from "@/lib/validations/borrow-records/search-borrow-records"

import { auth } from "../auth"

export type BorrowRecords = (BorrowRecord & {
  borrowRequest: BorrowRequestManagement
  processedByNavigation: Employee
  librarycard: LibraryCard
})[]

const getBorrowRecordsPatron = async (
  searchParams: TSearchBorrowRecordsSchema
): Promise<Pagination<BorrowRecords>> => {
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

    const { data } = await http.get<Pagination<BorrowRecords>>(
      `/api/users/borrows/records`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        searchParams: {
          ...searchParams,
          borrowDateRange:
            JSON.stringify(searchParams.borrowDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.borrowDateRange.map((d) =>
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
  } catch {
    return {
      pageIndex: 0,
      pageSize: 0,
      sources: [],
      totalActualItem: 0,
      totalPage: 0,
    }
  }
}

export default getBorrowRecordsPatron
