import { useAuth } from "@/contexts/auth-provider"
import { useMutation } from "@tanstack/react-query"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

type Params = {
  classificationNumber: string
  cutterNumber: string
  title: string
  subTitle: string | null
  author: string
  topicalTerms: string | null
}

function useCreateGroup() {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: async (body: Params): Promise<ActionResponse<string>> => {
      try {
        const { message } = await http.post(
          `/api/management/library-items/group`,
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

export default useCreateGroup
