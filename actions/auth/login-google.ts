//loginByOtp
"use server"

import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

type TLoginGoogleData = {
  accessToken: string
  refreshToken: string
}

export async function loginGoogle(code: string): Promise<ActionResponse> {
  try {
    const { data } = await http.post<TLoginGoogleData>(
      "/api/auth/sign-in-google",
      {
        code,
      }
    )

    const cookiesStore = cookies()
    cookiesStore.set("accessToken", data.accessToken)
    cookiesStore.set("refreshToken", data.refreshToken)

    revalidateTag("who-am-i")

    return {
      isSuccess: true,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
