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

    const isProduction = process.env.NODE_ENV === "production"

    const cookiesStore = cookies()
    cookiesStore.set("accessToken", data.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "strict",
      path: "/",
    })
    cookiesStore.set("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "strict",
      path: "/",
    })

    revalidateTag("who-am-i")

    return {
      isSuccess: true,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
