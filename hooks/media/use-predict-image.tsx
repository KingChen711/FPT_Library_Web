import { useMutation } from "@tanstack/react-query"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type PredictResult } from "@/lib/types/models"

function usePredictImage() {
  return useMutation({
    mutationFn: async (
      formData: FormData
    ): Promise<
      ActionResponse<{
        message: string
        predictResult: PredictResult
      }>
    > => {
      try {
        const { data, message } = await http.post<PredictResult>(
          `/api/library-items/ai/predict/v2`,
          formData
        )

        if (!data) throw new Error("")

        return {
          isSuccess: true,
          data: {
            message: message,
            predictResult: data,
          },
        }
      } catch (error) {
        return handleHttpError(error)
      }
    },
  })
}

export default usePredictImage
