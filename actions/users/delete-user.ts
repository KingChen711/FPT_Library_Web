"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function deleteUser(
  userId: string
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()

  try {
    const { message } = await http.delete(`/api/management/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })

    revalidatePath("/management/users")

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
