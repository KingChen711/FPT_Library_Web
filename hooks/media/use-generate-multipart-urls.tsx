import { useAuth } from "@/contexts/auth-provider"
import { useMutation } from "@tanstack/react-query"

import { http } from "@/lib/http"

type Response = {
  urls: string[]
  uploadId: string
  s3PathKey: string
}

function useGenerateMultipartUrls() {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: async (totalParts: number): Promise<Response | null> => {
      try {
        const { data } = await http.get<Response>(
          `/api/management/resources/parts/urls?totalParts=${totalParts}`,
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
  })
}

export default useGenerateMultipartUrls
