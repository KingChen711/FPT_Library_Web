"use server"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TRegisterSchema } from "@/lib/validations/auth/register"

export async function register(body: TRegisterSchema): Promise<ActionResponse> {
  try {
    await http.post("/api/auth/sign-up", body)

    return {
      isSuccess: true,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
