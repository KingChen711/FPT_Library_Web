import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type Floor } from "@/lib/types/models"

function useFloors() {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["floors", accessToken],
    queryFn: async () => {
      try {
        const { data } = await http.get<Floor[]>(
          `/api/management/location/floors`,
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
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
}

export default useFloors
