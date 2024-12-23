//changePassword
"use server"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function changePassword(
  email: string,
  password: string,
  token: string,
  type: "user" | "employee"
): Promise<ActionResponse<string>> {
  try {
    const { message } = await http.patch(
      `/api/auth${type === "employee" ? "/employee" : ""}/change-password`,
      {
        email,
        password,
        token,
      }
    )

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
