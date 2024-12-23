"use server"

import { revalidateTag } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TUserDialogSchema } from "@/lib/validations/auth/user-dialog"

export async function createUser(
  body: TUserDialogSchema
): Promise<ActionResponse> {
  const { getAccessToken } = auth()

  try {
    await http.post("/api/management/users", body, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })

    revalidateTag("users")

    return {
      isSuccess: true,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
