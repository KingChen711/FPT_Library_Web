"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function editConfiguration(
  fields: { name: string; value: string }[]
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()
  try {
    const [{ message }] = await Promise.all(
      fields.map((f) =>
        http.patch(`/api/admin-configuration`, f, {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`,
          },
        })
      )
    )

    revalidatePath("/management/system-configuration")

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
