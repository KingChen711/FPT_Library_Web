import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type LibraryItem } from "@/lib/types/models"

export type NewArrivalsResponse = {
  sources: LibraryItem[]
  pageIndex: number
  pageSize: number
  totalPage: number
}

function useNewArrivals() {
  return useQuery({
    queryKey: ["new-arrivals"],
    queryFn: async () => {
      try {
        const { data } = await http.get<NewArrivalsResponse>(
          `/api/library-items/new-arrivals`
        )

        return data.sources
      } catch {
        return []
      }
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
}

export default useNewArrivals
