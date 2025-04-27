import { useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type LibraryItem } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"

function useRecentlyItems(ids: number[]) {
  return useQuery({
    queryKey: [`recently-items`, ids],
    queryFn: async (): Promise<LibraryItem[]> => {
      try {
        const { data } = await http.get<Pagination<LibraryItem[]>>(
          `/api/library-items/recent-read`,
          {
            searchParams: {
              ids,
              pageIndex: 1,
              pageSize: 10,
            },
          }
        )

        return data?.sources || []
      } catch {
        return []
      }
    },
    refetchOnWindowFocus: false,
  })
}

export default useRecentlyItems
