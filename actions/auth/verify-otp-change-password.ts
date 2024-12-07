"use server"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function verifyOtpChangePassword(
  email: string,
  otp: string
): Promise<ActionResponse<{ token: string }>> {
  try {
    const { data } = await http.post<{ token: string }>(
      "/api/auth/change-password/verify-otp",
      {
        email,
        otp,
      }
    )

    return {
      isSuccess: true,
      data,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
