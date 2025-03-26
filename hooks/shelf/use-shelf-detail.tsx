import { useAuth } from "@/contexts/auth-provider"
import { useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import {
  type Floor,
  type Section,
  type Shelf,
  type Zone,
} from "@/lib/types/models"

type Response = {
  floor: Floor
  zone: Zone
  section: Section
  libraryShelf: Shelf
}

function useShelfDetail(shelfId: number | null) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["location", "shelves", shelfId, accessToken],
    queryFn: async (): Promise<Response | null> => {
      if (!shelfId) return null
      try {
        const { data } = await http.get<Response>(
          `/api/location/shelves/${shelfId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        return data || null
      } catch {
        return null
      }
    },
    enabled: !!shelfId,
  })
}

export default useShelfDetail
