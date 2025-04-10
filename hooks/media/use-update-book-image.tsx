import { NOT_CLOUDINARY_URL } from "@/constants"
import { useAuth } from "@/contexts/auth-provider"
import { useMutation } from "@tanstack/react-query"

import { http } from "@/lib/http"

function useUpdateBookImage() {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: async ({ prevUrl, file }: { prevUrl: string; file: File }) => {
      try {
        const publicId = prevUrl.match(
          /upload\/(?:v\d+\/)?([^\/]+)\.(?:jpg|jpeg|png|pdf)$/
        )?.[1]

        if (!publicId) return NOT_CLOUDINARY_URL

        const formData = new FormData()
        formData.append("file", file)
        formData.append("publicId", publicId)

        const { data } = await http.put<{
          secureUrl: string
          publicId: string
        }>(`/api/management/resources/images/update`, formData, {
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

export default useUpdateBookImage
