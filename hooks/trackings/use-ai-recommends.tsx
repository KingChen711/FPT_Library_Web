/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import {
  type BookEdition,
  type SupplementRequestDetail,
} from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchAIRecommendsSchema } from "@/lib/validations/trackings/search-ai-recommend"

export type TAIRecommends = Pagination<
  (SupplementRequestDetail & {
    relatedLibraryItem: BookEdition
  })[]
>

const defaultResponse: TAIRecommends = {
  sources: [],
  pageIndex: 1,
  pageSize: 10,
  totalActualItem: 0,
  totalPage: 0,
}

function useAIRecommends(
  trackingId: number,
  searchParams: TSearchAIRecommendsSchema
) {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: [
      "/api/management/warehouse-trackings/",
      trackingId,
      "supplement-details",
      searchParams,
      accessToken,
    ],
    queryFn: async (): Promise<TAIRecommends> => {
      if (!accessToken) return defaultResponse

      try {
        const { data } = await http.get<TAIRecommends>(
          `/api/management/warehouse-trackings/${trackingId}/supplement-details`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            searchParams: {
              ...searchParams,
              pageCountRange:
                JSON.stringify(searchParams.pageCountRange) ===
                JSON.stringify([null, null])
                  ? null
                  : searchParams.pageCountRange.map((d) =>
                      d === null ? "" : d
                    ),
              averageRatingRange:
                JSON.stringify(searchParams.averageRatingRange) ===
                JSON.stringify([null, null])
                  ? null
                  : searchParams.averageRatingRange.map((d) =>
                      d === null ? "" : d
                    ),
              ratingsCountRange:
                JSON.stringify(searchParams.ratingsCountRange) ===
                JSON.stringify([null, null])
                  ? null
                  : searchParams.ratingsCountRange.map((d) =>
                      d === null ? "" : d
                    ),
            },
          }
        )

        return data || defaultResponse
      } catch {
        return defaultResponse
      }
    },
    placeholderData: keepPreviousData,
  })
}

export default useAIRecommends
