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
