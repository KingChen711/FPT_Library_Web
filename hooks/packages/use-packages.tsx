import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type Package } from "@/lib/types/models"

function usePackages() {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["packages", accessToken],
    queryFn: async () => {
      try {
        const { data } = await http.get<Package[]>(`/api/management/packages`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })

        return data
      } catch {
        return []
      }
    },
    enabled: !!accessToken,
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export default usePackages
