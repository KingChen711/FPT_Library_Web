import { useAuth } from "@/contexts/auth-provider"
import { useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import {
  type Author,
  type BookEdition,
  type Category,
  type LibraryItemAuthor,
  type Shelf,
} from "@/lib/types/models"

const pageSize = 8
const pageIndex = 1

function useSearchLibraryItems(search = "", enabled = true) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["management-library-items", search, accessToken],
    queryFn: async () => {
      if (!search) return []
      try {
        const { data } = await http.get<{
          sources: (BookEdition & {
            category: Category
            libraryItemAuthors: (LibraryItemAuthor & { author: Author })[]
            shelf: Shelf | null
          })[]
        }>(`/api/management/library-items`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          searchParams: {
            pageIndex,
            pageSize,
            search,
          },
        })

        return data.sources
      } catch {
        return []
      }
    },
    enabled,
  })
}

export default useSearchLibraryItems
