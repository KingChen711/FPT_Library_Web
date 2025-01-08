import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type Shelf } from "@/lib/types/models"

function useShelves(sectionId: number | null | undefined) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["shelves", sectionId, accessToken],
    queryFn: async () => {
      try {
        const { data } = await http.get<Shelf[]>(
          `/api/management/location/shelves`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            searchParams: {
              sectionId,
            },
          }
        )
        return data || []
      } catch {
        return []
      }
    },
    enabled: !!sectionId,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
}

export default useShelves
