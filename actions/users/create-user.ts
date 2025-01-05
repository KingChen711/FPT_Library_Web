"use server"

import { revalidateTag } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TMutateUserSchema } from "@/lib/validations/user/mutate-user"

export async function createUser(
  body: TMutateUserSchema
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()

  try {
    const { message } = await http.post("/api/management/users", body, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })

    revalidateTag("users")

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
