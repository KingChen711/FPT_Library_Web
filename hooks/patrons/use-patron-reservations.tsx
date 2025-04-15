/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

import { http } from "@/lib/http"
import {
  type BookEdition,
  type ReservationQueueManagement,
} from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchBorrowReservationsSchema } from "@/lib/validations/reservations/search-reservations"

function usePatronReservations(
  userId: string,
  searchParams: TSearchBorrowReservationsSchema
) {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: [
      "management",
      "borrow-reservations",
      accessToken,
      userId,
      searchParams,
    ],
    queryFn: async () => {
      const formatDate = (d: Date) => format(d, "yyyy-MM-dd")
      try {
        if (!accessToken) throw new Error()

        const { data } = await http.get<
          Pagination<
            (ReservationQueueManagement & { libraryItem: BookEdition })[]
          >
        >(`/api/management/library-card-holders/${userId}/reservations`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          searchParams: {
            ...searchParams,
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
            expectedAvailableDateMaxRange:
              JSON.stringify(searchParams.expectedAvailableDateMaxRange) ===
              JSON.stringify([null, null])
                ? null
                : searchParams.expectedAvailableDateMaxRange.map((d) =>
                    d === null ? "" : formatDate(new Date(d))
                  ),
            expectedAvailableDateMinRange:
              JSON.stringify(searchParams.expectedAvailableDateMinRange) ===
              JSON.stringify([null, null])
                ? null
                : searchParams.expectedAvailableDateMinRange.map((d) =>
                    d === null ? "" : formatDate(new Date(d))
                  ),
            expiryDateRange:
              JSON.stringify(searchParams.expiryDateRange) ===
              JSON.stringify([null, null])
                ? null
                : searchParams.expiryDateRange.map((d) =>
                    d === null ? "" : formatDate(new Date(d))
                  ),
            reservationDateRange:
              JSON.stringify(searchParams.reservationDateRange) ===
              JSON.stringify([null, null])
                ? null
                : searchParams.reservationDateRange.map((d) =>
                    d === null ? "" : formatDate(new Date(d))
                  ),
          },
        })

        return data
      } catch {
        return {
          sources: [],
          pageIndex: searchParams.pageIndex,
          pageSize: +searchParams.pageSize,
          totalActualItem: 0,
          totalPage: 0,
        }
      }
    },
    placeholderData: keepPreviousData,
  })
}

export default usePatronReservations
