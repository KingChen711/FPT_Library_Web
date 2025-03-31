import { useAuth } from "@/contexts/auth-provider"
import { useMutation } from "@tanstack/react-query"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

function useCancelRequestItem() {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: async ({
      libraryCardId,
      libraryItemId,
      requestId,
    }: {
      requestId: number
      libraryItemId: number
      libraryCardId: string
    }): Promise<ActionResponse<string>> => {
      try {
        const { message } = await http.patch(
          `/api/management/borrows/requests/${requestId}/details/${libraryItemId}/cancel?libraryCardId=${libraryCardId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        return {
          isSuccess: true,
          data: message,
        }
      } catch (error) {
        return handleHttpError(error)
      }
    },
  })
}

export default useCancelRequestItem
