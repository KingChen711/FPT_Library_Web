//verifyEmail
"use server"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function verifyEmail(
  email: string,
  emailVerificationCode: string
): Promise<ActionResponse<string>> {
  try {
    const { message } = await http.patch("/api/auth/sign-up/confirm", {
      email,
      emailVerificationCode,
    })

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
