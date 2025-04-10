import { useAuth } from "@/contexts/auth-provider"
import { useMutation } from "@tanstack/react-query"

import { http } from "@/lib/http"

function useUploadVideo() {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("resourceType", "BookAudio")

      try {
        const { data } = await http.post<{
          secureUrl: string
          publicId: string
        }>(`/api/management/resources/videos/upload`, formData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        return data
      } catch {
        return null
      }
    },
  })
}

export default useUploadVideo
