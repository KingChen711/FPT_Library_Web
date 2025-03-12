import { useAuth } from "@/contexts/auth-provider"
import { useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type TrackingDetail } from "@/lib/types/models"

const pageSize = 8
const pageIndex = 1

function useTrackingDetailsNoItem(
  trackingId: number | null | undefined,
  search = ""
) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["tracking-details-no-item", trackingId, search, accessToken],
    queryFn: async () => {
      if (!trackingId || !search) return []
      try {
        const { data } = await http.get<{ sources: TrackingDetail[] }>(
          `/api/management/warehouse-trackings/${trackingId}/details/no-item`,
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

        return data.sources || []
      } catch {
        return []
      }
    },
  })
}

export default useTrackingDetailsNoItem
