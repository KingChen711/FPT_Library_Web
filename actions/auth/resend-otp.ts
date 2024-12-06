"use server"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function resendOtp(
  email: string
): Promise<ActionResponse<string>> {
  try {
    const { message } = await http.post("/api/auth/resend-otp", { email })

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
