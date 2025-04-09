import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type Condition } from "@/lib/types/models"

function useConditions() {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["conditions", accessToken],
    queryFn: async () => {
      try {
        const { data } = await http.get<Condition[]>(
          `/api/management/conditions`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        return data
      } catch {
        return []
      }
    },
    enabled: !!accessToken,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  })
}

export default useConditions
