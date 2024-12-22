"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TProfileSchema } from "@/lib/validations/auth/profile"

export async function updateProfile(
  body: TProfileSchema
): Promise<ActionResponse<string>> {
  try {
    const { getAccessToken } = auth()

    const { message } = await http.put("/api/auth/profile", body, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
      cache: "no-cache",
    })

    revalidatePath("/me/account/profile")
    revalidateTag("who-am-i")

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
