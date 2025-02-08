import { useAuth } from "@/contexts/auth-provider"
import { useMutation } from "@tanstack/react-query"

import { http } from "@/lib/http"

export type TCheckCoverImageRes = {
  fieldPointsWithThreshole: {
    name: string
    detail: string
    matchedPoint: number
    isPassed: boolean
  }[]
  totalPoint: number
  confidenceThreshold: number
}

function useCheckCoverImage() {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const { data } = await http.post<TCheckCoverImageRes[]>(
        `/api/ocr`,
        formData,
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

export default useCheckCoverImage
