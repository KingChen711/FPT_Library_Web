import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type Zone } from "@/lib/types/models"

function useZones(floorId: number | null | undefined) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["zones", floorId, accessToken],
    queryFn: async () => {
      try {
        const { data } = await http.get<Zone[]>(
          `/api/management/location/zones`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            searchParams: {
              floorId,
            },
          }
        )
        return data || []
      } catch {
        return []
      }
    },
    enabled: !!floorId,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
}

export default useZones
