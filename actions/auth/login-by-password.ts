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
  body: TLoginByPasswordSchema,
  type: "user" | "employee" | "admin"
): Promise<ActionResponse<TLoginByPasswordData>> {
  let url = ""

  if (type === "user") {
    url = `/api/auth/sign-in/password-method`
  } else {
    url = `/api/auth${type === "employee" ? "/employee" : "/admin"}/sign-in`
  }

  try {
    const { data } = await http.post<TLoginByPasswordData>(url, body)

    const isProduction = process.env.NODE_ENV === "production"

    const cookiesStore = cookies()
    cookiesStore.set("accessToken", data.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "none",
      path: "/",
    })
    cookiesStore.set("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "strict" : "none",
      path: "/",
    })

    revalidateTag("who-am-i")

    return {
      isSuccess: true,
      data,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
