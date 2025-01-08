import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type Section } from "@/lib/types/models"

function useSections(zoneId: number | null | undefined) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["sections", zoneId, accessToken],
    queryFn: async () => {
      try {
        const { data } = await http.get<Section[]>(
          `/api/management/location/sections`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            searchParams: {
              zoneId,
            },
          }
        )
        return data || []
      } catch {
        return []
      }
    },
    enabled: !!zoneId,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
}

export default useSections
