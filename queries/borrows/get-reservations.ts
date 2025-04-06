/* eslint-disable @typescript-eslint/ban-ts-comment */
import { http } from "@/lib/http"

import "server-only"

import { format } from "date-fns"

import {
  type BookEdition,
  type LibraryCard,
  type ReservationQueueManagement,
} from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchBorrowReservationsSchema } from "@/lib/validations/reservations/search-reservations"

import { auth } from "../auth"

export type BorrowReservations = (ReservationQueueManagement & {
  libraryCard: LibraryCard
  libraryItem: BookEdition
})[]

const getBorrowReservations = async (
  searchParams: TSearchBorrowReservationsSchema
): Promise<Pagination<BorrowReservations>> => {
  const { getAccessToken } = auth()

  const formatDate = (d: Date) => format(d, "yyyy-MM-dd")
  try {
    const { data } = await http.get<Pagination<BorrowReservations>>(
      `/api/management/reservations`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        searchParams: {
          ...searchParams,
          reservationDateRange:
            JSON.stringify(searchParams.reservationDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.reservationDateRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
          expiryDateRange:
            JSON.stringify(searchParams.expiryDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.expiryDateRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
          assignDateRange:
            JSON.stringify(searchParams.assignDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.assignDateRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
          collectedDateRange:
            JSON.stringify(searchParams.collectedDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.collectedDateRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
          expectedAvailableDateMinRange:
            JSON.stringify(searchParams.expectedAvailableDateMinRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.expectedAvailableDateMinRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
          expectedAvailableDateMaxRange:
            JSON.stringify(searchParams.expectedAvailableDateMaxRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.expectedAvailableDateMaxRange.map((d) =>
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
      totalActualItem: 0,
      totalPage: 0,
    }
  }
}

export default getBorrowReservations
