import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type BookResource } from "@/lib/types/models"

function useResourceDetail(resourceId: number) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: [`library-items/resources/${resourceId}`],
    queryFn: async () => {
      try {
        const { data } = await http.get<BookResource | null>(
          `/api/library-items/resources/${resourceId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        return data
      } catch {
        return null
      }
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
}

export default useResourceDetail
