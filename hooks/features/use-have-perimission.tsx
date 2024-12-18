import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { EAccessLevel, type EFeature } from "@/lib/types/enums"

function useHasPermission(feature: EFeature, accessLevel: EAccessLevel) {
  const { accessToken } = useAuth()
  const { data, isLoading } = useQuery({
    queryKey: ["accessible-features", accessToken],
    queryFn: async () => {
      try {
        const { data } = await http.get<{ permissionLevel: EAccessLevel }>(
          `/api/features/${feature}/authorized-permission`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
            next: {
              revalidate: 0,
            },
          }
        )

        return data.permissionLevel || EAccessLevel.ACCESS_DENIED
      } catch {
        return EAccessLevel.ACCESS_DENIED
      }
    },
    placeholderData: keepPreviousData,
  })

  const hasPermission = isLoading ? false : data! >= accessLevel

  return { isLoading, hasPermission }
}

export default useHasPermission
