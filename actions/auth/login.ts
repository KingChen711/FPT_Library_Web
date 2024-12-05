"use server"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TLoginSchema } from "@/lib/validations/auth/login"

export async function login(
  body: TLoginSchema
): Promise<ActionResponse<string>> {
  try {
    const { resultCode } = await http.post("/api/auth/sign-in", body)

    return {
      isSuccess: true,
      data: resultCode,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
