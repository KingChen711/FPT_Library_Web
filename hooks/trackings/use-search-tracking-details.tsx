/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useAuth } from "@/contexts/auth-provider"
import { type TTrackingDetailItems } from "@/queries/trackings/get-tracking-details"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type TSearchTrackingDetailsSchema } from "@/lib/validations/trackings/search-tracking-details"

const defaultResponse: TTrackingDetailItems = {
  result: {
    sources: [],
    pageIndex: 1,
    pageSize: 10,
    totalActualItem: 0,
    totalPage: 0,
  },
  statisticSummary: {
    totalCatalogedInstanceItem: 0,
    totalCatalogedItem: 0,
    totalInstanceItem: 0,
    totalItem: 0,
    trackingId: 0,
  },
  statistics: [],
}

function useTrackingDetails(
  trackingId: number,
  searchParams: TSearchTrackingDetailsSchema
) {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: [
      "/api/management/warehouse-trackings/",
      trackingId,
      "details",
      searchParams,
      accessToken,
    ],
    queryFn: async (): Promise<TTrackingDetailItems> => {
      if (!accessToken) return defaultResponse
      Object.keys(searchParams.v).forEach((k) => {
        //@ts-ignore
        const value = searchParams.v[k]

        if (value === "null,null") {
          //@ts-ignore
          searchParams.v[k] = ""
        }
      })

      try {
        const { data } = await http.get<TTrackingDetailItems>(
          `/api/management/warehouse-trackings/${trackingId}/details`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            searchParams,
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

export default useTrackingDetails
