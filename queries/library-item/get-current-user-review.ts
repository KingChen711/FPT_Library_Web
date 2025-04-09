import { http } from "@/lib/http"

import "server-only"

import { type ReviewsLibraryItem } from "@/lib/types/models"

import { auth } from "../auth"

const getCurrentUserReview = async (
  libraryItemId: number
): Promise<ReviewsLibraryItem | null> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<ReviewsLibraryItem>(
      `/api/library-item-reviews/${libraryItemId}`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )
    return data || null
  } catch {
    return null
  }
}

export default getCurrentUserReview
