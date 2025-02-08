import { useAuth } from "@/contexts/auth-provider"
import { useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type Supplier, type Tracking } from "@/lib/types/models"

const pageSize = 8
const pageIndex = 1

type Trackings = (Tracking & { supplier: Supplier })[]

function useSearchTrackings(search = "") {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["management-trackings", search, accessToken],
    queryFn: async () => {
      if (!search) return []
      try {
        const { data } = await http.get<{ sources: Trackings }>(
          `/api/management/warehouse-trackings`,
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

export default useSearchTrackings
