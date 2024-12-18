import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type EFeature } from "@/lib/types/enums"

function useAccessibleFeatures() {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: ["accessible-features", accessToken],
    queryFn: async () => {
      try {
        if (!accessToken) return []

        return await http
          .get<{ featureId: EFeature }[]>(`/api/features/authorized`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          })
          .then((res) => res.data)
      } catch {
        return []
      }
    },
    placeholderData: keepPreviousData,
  })
}

export default useAccessibleFeatures
