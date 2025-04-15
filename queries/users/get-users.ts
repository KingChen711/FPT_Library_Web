import { http } from "@/lib/http"

import "server-only"

import { format } from "date-fns"

import { type User } from "@/lib/types/models"
import { type TSearchUsersSchema } from "@/lib/validations/user/search-user"

import { auth } from "../auth"

export type Users = User[]

export type TGetUsersData = {
  sources: User[]
  pageIndex: number
  pageSize: number
  totalPage: number
  totalActualItem: number
}

const getUsers = async (
  searchParams: TSearchUsersSchema
): Promise<TGetUsersData> => {
  const { getAccessToken } = auth()
  try {
    const formatDate = (d: Date) => format(d, "yyyy-MM-dd")
    const { data } = await http.get<TGetUsersData>(`/api/management/users`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
      searchParams: {
        ...searchParams,
        createDateRange:
          JSON.stringify(searchParams.createDateRange) ===
          JSON.stringify([null, null])
            ? null
            : searchParams.createDateRange.map((d) =>
                d === null ? "" : formatDate(new Date(d))
              ),
        dobRange:
          JSON.stringify(searchParams.dobRange) === JSON.stringify([null, null])
            ? null
            : searchParams.dobRange.map((d) =>
                d === null ? "" : formatDate(new Date(d))
              ),

        modifiedDateRange:
          JSON.stringify(searchParams.modifiedDateRange) ===
          JSON.stringify([null, null])
            ? null
            : searchParams.modifiedDateRange.map((d) =>
                d === null ? "" : formatDate(new Date(d))
              ),
      },
    })

    return data
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

export default getUsers
