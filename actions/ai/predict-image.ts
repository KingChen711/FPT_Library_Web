"use server"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type PredictResult } from "@/lib/types/models"

export async function predictImage(
  formData: FormData
): Promise<ActionResponse<{ message: string; data: PredictResult }>> {
  try {
    const { data, resultCode, message } = await http.post<PredictResult>(
      `/api/library-items/ai/predict`,
      formData
    )

    if (resultCode === "SYS.Fail0008" && Array.isArray(data)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return data as any
    }

    return {
      isSuccess: true,
      data: {
        message: message,
        data,
      },
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
