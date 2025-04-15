import { useAuth } from "@/contexts/auth-provider"
import { useMutation } from "@tanstack/react-query"

import { http } from "@/lib/http"

function useUploadSingle() {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: async (file: File): Promise<string | null> => {
      const formData = new FormData()
      formData.append("File", file)
      try {
        const { data } = await http.post<string>(
          `/api/management/resources/small-videos/upload`,
          formData,
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

export default useUploadSingle
