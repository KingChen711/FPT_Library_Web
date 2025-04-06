import { http } from "@/lib/http"

import "server-only"

import { type ReviewsLibraryItem } from "@/lib/types/models"
import { type TSearchLibraryItemSchema } from "@/lib/validations/library-items/search-library-items"

import { auth } from "../auth"

export type TGetReviewsLibraryItemsData = {
  sources: ReviewsLibraryItem[]
  pageIndex: number
  pageSize: number
  totalPage: number
  totalActualItem: number
}

const getReviewsLibraryItem = async (
  categoryId: number,
  searchParams: TSearchLibraryItemSchema
): Promise<TGetReviewsLibraryItemsData> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<TGetReviewsLibraryItemsData>(
      `/api/library-items/${categoryId}/reviews`,
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

export default getReviewsLibraryItem
