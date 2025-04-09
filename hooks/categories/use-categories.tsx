import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type Category } from "@/lib/types/models"

function useCategories() {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["categories", accessToken],
    queryFn: async () => {
      try {
        const { data } = await http.get<Category[]>(
          `/api/management/categories`,
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
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export default useCategories
