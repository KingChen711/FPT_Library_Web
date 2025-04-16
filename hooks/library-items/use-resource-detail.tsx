import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type BookResource } from "@/lib/types/models"

export type ResourcePublic = Omit<
  BookResource,
  "resourceUrl" | "s3OriginalName"
>

function useResourcePublicDetail(resourceId: number) {
  return useQuery({
    queryKey: [`library-items/resources/${resourceId}/public`],
    queryFn: async (): Promise<ResourcePublic | null> => {
      try {
        const { data } = await http.get<ResourcePublic>(
          `/api/library-items/resources/${resourceId}/public`
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

export default useResourcePublicDetail
