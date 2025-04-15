import { useAuth } from "@/contexts/auth-provider"
import { useMutation } from "@tanstack/react-query"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

type Params = {
  s3PathKey: string
  uploadId: string
  uploadedParts: {
    partNumber: number
    eTag: string
  }[]
}

function useCompleteMultipart() {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: async (body: Params): Promise<ActionResponse<string>> => {
      try {
        const { message } = await http.post(
          `/api/management/resources/parts/complete`,
          body,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        return { isSuccess: true, data: message }
      } catch (error) {
        return handleHttpError(error)
      }
    },
  })
}

export default useCompleteMultipart
