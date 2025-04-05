import { http } from "@/lib/http"

import "server-only"

import { type Category } from "@/lib/types/models"

import { auth } from "../auth"

type Categories = Category[]

const getCategories = async (): Promise<Categories> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<Categories>(`/api/management/categories?`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })

    return data || []
  } catch {
    return []
  }
}

export default getCategories
