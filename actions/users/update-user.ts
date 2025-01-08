"use server"

import { revalidateTag } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { convertGenderToNumber } from "@/lib/utils"
import { type TMutateUserSchema } from "@/lib/validations/user/mutate-user"

export async function updateUser(
  userId: string,
  body: Omit<TMutateUserSchema, "email">
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()

  try {
    const { message } = await http.put(
      `/api/management/users/${userId}`,
      {
        ...body,
        gender: convertGenderToNumber(body.gender),
      },
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidateTag("users")

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
