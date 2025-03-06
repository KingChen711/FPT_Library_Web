import { useAuth } from "@/contexts/auth-provider"
import { useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import {
  type Author,
  type BookEdition,
  type Category,
  type LibraryItemAuthor,
} from "@/lib/types/models"

function useLibraryItem(libraryItemId: number, enabled: boolean) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: [`management-library-items`, libraryItemId, accessToken],
    queryFn: async () => {
      try {
        const { data } = await http.get<
          | (BookEdition & {
              authors: Author[]
              libraryItemAuthors: (LibraryItemAuthor & { author: Author })[]
              category: Category
            })
          | null
        >(`/api/management/library-items/${libraryItemId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        return data
      } catch {
        return null
      }
    },
    refetchOnWindowFocus: false,
    enabled,
  })
}

export default useLibraryItem
