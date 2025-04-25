import { useAuth } from "@/contexts/auth-provider"
import { useMutation } from "@tanstack/react-query"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TCreateGroupSchema } from "@/lib/validations/books/create-group"

function useCreateGroup() {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: async (
      body: TCreateGroupSchema
    ): Promise<ActionResponse<string>> => {
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
