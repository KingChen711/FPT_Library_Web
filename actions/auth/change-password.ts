//changePassword
"use server"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function changePassword(
  email: string,
  password: string,
  token: string
): Promise<ActionResponse<string>> {
  try {
    const { message } = await http.patch("/api/auth/change-password", {
      email,
      password,
      token,
    })

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
