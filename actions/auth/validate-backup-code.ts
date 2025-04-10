//validateBackupCode
"use server"

import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

type TValidateBackupCode = {
  accessToken: string
  refreshToken: string
}

export async function validateBackupCode(
  email: string,
  backupCode: string
): Promise<ActionResponse<TValidateBackupCode>> {
  try {
    const { data } = await http.post<TValidateBackupCode>(
      "/api/auth/validate-mfa-backup",
      {
        email,
        backupCode,
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
      data,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
