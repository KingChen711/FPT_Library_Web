import { http } from "@/lib/http"

import "server-only"

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
    const { data } = await http.get<TGetUsersData>(`/api/management/users`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
      searchParams,
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
