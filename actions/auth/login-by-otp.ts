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
