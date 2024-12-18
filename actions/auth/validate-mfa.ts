"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { cookies } from "next/headers"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

type TValidateMfa = {
  accessToken: string
  refreshToken: string
}

export async function validateMfa(
  email: string,
  otp: string
): Promise<ActionResponse<TValidateMfa>> {
  try {
    const { data } = await http.post<TValidateMfa>("/api/auth/validate-mfa", {
      email,
      otp,
    })

    const cookiesStore = cookies()
    cookiesStore.set("accessToken", data.accessToken)
    cookiesStore.set("refreshToken", data.refreshToken)

    revalidateTag("who-am-i")
    revalidatePath("/me/account/security")
    revalidatePath("/en/me/account/security")
    revalidatePath("/vi/me/account/security")

    return {
      isSuccess: true,
      data,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
