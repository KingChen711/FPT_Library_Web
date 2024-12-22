"use server"

import { revalidateTag } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function softDeleteRangeAuthor(
  authorIds: string[]
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()

  try {
    const { message } = await http.patch(
      `/api/management/authors/soft-delete-range`,
      {
        ids: authorIds,
      },
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidateTag("authors")

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
