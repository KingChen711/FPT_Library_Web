import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type LibraryItem } from "@/lib/types/models"

function useLibraryItemDetail(libraryItemId: string) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: [`library-items/${libraryItemId}`],
    queryFn: async () => {
      try {
        const { data } = await http.get<LibraryItem | null>(
          `/api/library-items/${libraryItemId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        return data
      } catch {
        return null
      }
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
}

export default useLibraryItemDetail
