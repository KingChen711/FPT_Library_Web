import { http } from "@/lib/http"

import "server-only"

import { format } from "date-fns"

import { type Patron } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchPatronsSchema } from "@/lib/validations/holders/search-patrons"

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
          createDateRage:
            JSON.stringify(searchParams.createDateRage) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.createDateRage.map((d) =>
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
