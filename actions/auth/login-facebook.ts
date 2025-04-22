//loginByOtp
"use server"

import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

type TLoginFacebookData = {
  accessToken: string
  refreshToken: string
}

export async function loginFacebook(
  accessToken: string,
  expiresIn: number
): Promise<ActionResponse> {
  try {
    const { data } = await http.post<TLoginFacebookData>(
      "/api/auth/sign-in-facebook",
      {
        accessToken,
        expiresIn,
      }
    )

    const isProduction = process.env.NODE_ENV === "production"

    const cookiesStore = cookies()
    cookiesStore.set("accessToken", data.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 2,
    })
    cookiesStore.set("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 2,
    })

    revalidateTag("who-am-i")

    return {
      isSuccess: true,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
