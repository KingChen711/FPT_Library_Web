import { useAuth } from "@/contexts/auth-provider"
import { useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import {
  type Author,
  type BookEdition,
  type LibraryItemAuthor,
} from "@/lib/types/models"

const pageSize = 8
const pageIndex = 1

function useSearchLibraryItems(search = "") {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["management-library-items", search, accessToken],
    queryFn: async () => {
      if (!search) return []
      try {
        const { data } = await http.get<{
          sources: (BookEdition & {
            libraryItemAuthors: (LibraryItemAuthor & { author: Author })[]
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
  })
}

export default useSearchLibraryItems
