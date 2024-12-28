import { useAuth } from "@/contexts/auth-provider"
import { useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type Author } from "@/lib/types/models"

const pageSize = 8
const pageIndex = 1

function useSearchAuthors(search = "") {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["management-authors", search, accessToken],
    queryFn: async () => {
      if (!search) return []
      try {
        const { data } = await http.get<{ sources: Author[] }>(
          `/api/management/authors`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            searchParams: {
              pageIndex,
              pageSize,
              search,
            },
          }
        )

        return data.sources
      } catch {
        return []
      }
    },

    refetchOnWindowFocus: false,
  })
}

export default useSearchAuthors
