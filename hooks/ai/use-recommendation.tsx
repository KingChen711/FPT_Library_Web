import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type LibraryItemsRecommendation } from "@/lib/types/models"

function useLibraryItemRecommendation(libraryItemId: number) {
  return useQuery({
    queryKey: [`library-items/${libraryItemId}/recommendation`],
    queryFn: async () => {
      try {
        const { data } = await http.post<LibraryItemsRecommendation[] | []>(
          `/api/library-items/ai/recommendation/${libraryItemId}`,
          {}
        )

        return data as LibraryItemsRecommendation[]
      } catch {
        return []
      }
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
}

export default useLibraryItemRecommendation
