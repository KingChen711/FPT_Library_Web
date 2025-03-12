import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"

function useRangeBarcodes(trackingDetailId: number) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["range-barcodes", trackingDetailId, accessToken],
    queryFn: async () => {
      if (!accessToken || !trackingDetailId) return []

      try {
        const { data } = await http.get<string[]>(
          `/api/management/warehouse-trackings/details/${trackingDetailId}/range-barcode`,
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

    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
}

export default useRangeBarcodes
