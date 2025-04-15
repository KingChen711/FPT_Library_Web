import { http } from "@/lib/http"

import "server-only"

import { type LibraryItem } from "@/lib/types/models"
import { type TSearchLibraryItemSchema } from "@/lib/validations/library-items/search-library-items"

export type TGetRelatedLibraryItemsData = {
  sources: LibraryItem[]
  pageIndex: number
  pageSize: number
  totalPage: number
  totalActualItem: number
}

const getRelatedLibraryItems = async (
  categoryId: number,
  searchParams: Omit<TSearchLibraryItemSchema, "authorId">
): Promise<TGetRelatedLibraryItemsData> => {
  try {
    const { data } = await http.get<TGetRelatedLibraryItemsData>(
      `/api/library-items/${categoryId}/related-items`,
      {
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

export default getRelatedLibraryItems
