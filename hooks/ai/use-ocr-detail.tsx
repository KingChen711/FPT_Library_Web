import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type OcrDetail } from "@/lib/types/models"

function useOcrDetail(libraryItemId: number, imageToPredict: File) {
  const formData = new FormData()
  formData.append("imageToPredict", imageToPredict)

  const { accessToken } = useAuth()
  return useQuery({
    queryKey: [`library-items/${libraryItemId}/ocr-detail`],
    queryFn: async () => {
      try {
        const { data } = await http.post<OcrDetail | null>(
          `/api/library-items/${libraryItemId}/ocr-detail`,
          formData,
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

export default useOcrDetail
