import { useAuth } from "@/contexts/auth-provider"
import { useMutation } from "@tanstack/react-query"

import { http } from "@/lib/http"

function useUploadImage() {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: async (file: File | Blob) => {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("resourceType", "BookImage")

      try {
        const { data } = await http.post<{
          secureUrl: string
          publicId: string
        }>(`/api/management/resources/images/upload`, formData, {
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

export default useUploadImage
