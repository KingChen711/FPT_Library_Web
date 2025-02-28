import { useAuth } from "@/contexts/auth-provider"
import { useMutation } from "@tanstack/react-query"

import { http } from "@/lib/http"

export type TCheckExistBarcodeRes = {
  fieldPointsWithThreshole: {
    name: string
    detail: string
    matchedPoint: number
    isPassed: boolean
  }[]
  totalPoint: number
  confidenceThreshold: number
}

function useCheckExistBarcode() {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: async (barcode: string) => {
      if (!barcode) return false

      const { data } = await http.get<boolean>(
        `/api/management/library-items/instances/check-exist-barcode?barcode=${barcode}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      return data
    },
  })
}

export default useCheckExistBarcode
