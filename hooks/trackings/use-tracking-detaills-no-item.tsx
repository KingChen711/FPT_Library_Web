import { useAuth } from "@/contexts/auth-provider"
import { useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type TrackingDetail } from "@/lib/types/models"

function useTrackingDetailsNoItem(trackingId: number | null | undefined) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["tracking-details-no-item", trackingId, accessToken],
    queryFn: async () => {
      if (!trackingId) return []
      try {
        const { data } = await http.get<TrackingDetail[]>(
          `/api/management/warehouse-trackings/${trackingId}/details/no-item`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        return data || []
      } catch {
        return []
      }
    },
    enabled: !!trackingId,
    refetchOnWindowFocus: false,
  })
}

export default useTrackingDetailsNoItem
