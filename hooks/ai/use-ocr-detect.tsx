import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type OcrDetect } from "@/lib/types/models"

function useOcrDetect(libraryItemId: string, imageToPredict: File) {
  const formData = new FormData()
  formData.append("ImageToDetect", imageToPredict)

  const { accessToken } = useAuth()
  return useQuery({
    queryKey: [`library-items/${libraryItemId}/detect`],
    queryFn: async () => {
      try {
        const res = await http.post<OcrDetect | null>(
          `/api/library-items/${libraryItemId}/ai/raw-detect`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        return res.data
      } catch {
        return null
      }
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
}

export default useOcrDetect
