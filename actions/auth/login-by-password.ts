"use server"

import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TLoginByPasswordSchema } from "@/lib/validations/auth/login-by-password"

type TLoginByPasswordData = {
  accessToken: string
  refreshToken: string
}

export async function loginByPassword(
  body: TLoginByPasswordSchema
): Promise<ActionResponse<TLoginByPasswordData>> {
  try {
    const { data } = await http.post<TLoginByPasswordData>(
      "/api/auth/sign-in/password-method",
      body
    )

    const cookiesStore = cookies()
    cookiesStore.set("accessToken", data.accessToken)
    cookiesStore.set("refreshToken", data.refreshToken)

    revalidateTag("who-am-i")

    return {
      isSuccess: true,
      data,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
