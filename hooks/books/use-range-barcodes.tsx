import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type LibraryItem, type TrackingDetail } from "@/lib/types/models"

type Response = {
  barcodes: string[]
  warehouseTrackingDetail:
    | (TrackingDetail & { libraryItem: LibraryItem })
    | null
}

function useRangeBarcodes(trackingDetailId: number, enabled = true) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["range-barcodes", trackingDetailId, accessToken],
    queryFn: async (): Promise<Response> => {
      if (!accessToken || !trackingDetailId)
        return { barcodes: [], warehouseTrackingDetail: null }

      try {
        const { data } = await http.get<Response>(
          `/api/management/warehouse-trackings/details/${trackingDetailId}/range-barcode`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        return data
      } catch {
        return { barcodes: [], warehouseTrackingDetail: null }
      }
    },

    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    enabled,
  })
}

export default useRangeBarcodes
