import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type BookResource } from "@/lib/types/models"

export type ResourcePreview = Omit<
  BookResource,
  "resourceUrl" | "s3OriginalName"
>

function useResourceDetail(resourceId: number) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: [`library-items/resources/${resourceId}`, accessToken],
    queryFn: async (): Promise<ResourcePreview | null> => {
      if (!accessToken) return null
      try {
        const { data } = await http.get<ResourcePreview>(
          `/api/library-items/resources/${resourceId}`,
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
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
}

export default useResourceDetail
