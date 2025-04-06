import { useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type LibraryItem } from "@/lib/types/models"
import { type TSearchLibraryItemSchema } from "@/lib/validations/library-items/search-library-items"

export type TGetLibraryItemsData = {
  sources: LibraryItem[]
  pageIndex: number
  pageSize: number
  totalPage: number
  totalActualItem: number
}

function useLibraryItemByCategory(
  categoryId: number,
  searchParams: TSearchLibraryItemSchema
) {
  return useQuery({
    queryKey: [`library-items/${categoryId}`, categoryId, searchParams],
    queryFn: async () => {
      try {
        const { data } = await http.get<TGetLibraryItemsData>(
          `/api/library-items/category/${categoryId}`,
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
    },
    refetchOnWindowFocus: false,
  })
}

export default useLibraryItemByCategory
