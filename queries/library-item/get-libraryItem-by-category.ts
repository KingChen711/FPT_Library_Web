import { http } from "@/lib/http"

import "server-only"

import { type LibraryItem } from "@/lib/types/models"
import { type TSearchLibraryItemSchema } from "@/lib/validations/library-items/search-library-items"

import { auth } from "../auth"

export type TGetLibraryItemsData = {
  sources: LibraryItem[]
  pageIndex: number
  pageSize: number
  totalPage: number
  totalActualItem: number
}

const getLibraryItemByCategory = async (
  categoryId: number,
  searchParams: TSearchLibraryItemSchema
): Promise<TGetLibraryItemsData> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<TGetLibraryItemsData>(
      `/api/library-items/category/${categoryId}`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        searchParams,
      }
    )
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

export default getLibraryItemByCategory
