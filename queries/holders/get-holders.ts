import { http } from "@/lib/http"

import "server-only"

import { format } from "date-fns"

import { type Patron } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchPatronsSchema } from "@/lib/validations/patrons/search-patrons"

import { auth } from "../auth"

export type Patrons = Patron[]

const getPatrons = async (
  searchParams: TSearchPatronsSchema
): Promise<Pagination<Patrons>> => {
  const { getAccessToken } = auth()
  try {
    const formatDate = (d: Date) => format(d, "yyyy-MM-dd")
    const { data } = await http.get<Pagination<Patrons>>(
      `/api/management/library-card-holders`,
      {
        next: {
          tags: ["management-book-editions"],
        },
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        searchParams: {
          ...searchParams,
          cardIssueDateRange:
            JSON.stringify(searchParams.cardIssueDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.cardIssueDateRange.map((d) =>
                  d === null ? "null" : formatDate(new Date(d))
                ),
          cardExpiryDateRange:
            JSON.stringify(searchParams.cardExpiryDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.cardExpiryDateRange.map((d) =>
                  d === null ? "null" : formatDate(new Date(d))
                ),
          suspensionDateRange:
            JSON.stringify(searchParams.suspensionDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.suspensionDateRange.map((d) =>
                  d === null ? "null" : formatDate(new Date(d))
                ),
          dobRange:
            JSON.stringify(searchParams.dobRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.dobRange.map((d) =>
                  d === null ? "null" : formatDate(new Date(d))
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

export default getPatrons
