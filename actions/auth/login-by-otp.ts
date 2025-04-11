//loginByOtp
"use server"

import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

type TLoginByOtpData = {
  accessToken: string
  refreshToken: string
}

export async function loginByOtp(
  email: string,
  otp: string
): Promise<ActionResponse> {
  try {
    const { data } = await http.post<TLoginByOtpData>(
      "/api/auth/sign-in/otp-method",
      {
        email,
        otp,
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
