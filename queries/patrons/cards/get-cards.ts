import { http } from "@/lib/http"

import "server-only"

import { auth } from "@/queries/auth"
import { format } from "date-fns"

import { type LibraryCard } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchCardsSchema } from "@/lib/validations/patrons/cards/search-cards"

export type Cards = LibraryCard[]

const getCards = async (
  searchParams: TSearchCardsSchema
): Promise<Pagination<Cards>> => {
  const { getAccessToken } = auth()
  try {
    const formatDate = (d: Date) => format(d, "yyyy-MM-dd")

    const { data } = await http.get<Pagination<Cards>>(
      `/api/management/library-cards`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        searchParams: {
          ...searchParams,
          issueDateRange:
            JSON.stringify(searchParams.issueDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.issueDateRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
          expiryDateRange:
            JSON.stringify(searchParams.expiryDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.expiryDateRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
          suspensionDateRange:
            JSON.stringify(searchParams.suspensionDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.suspensionDateRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
        },
      }
    )

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
}

export default getCards
