"use server"

import { revalidateTag } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function updateAuthor(
  userId: number,
  //TODO: fix any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any
): Promise<ActionResponse> {
  const { getAccessToken } = auth()

  try {
    await http.put(`/api/management/authors/${userId}`, body, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })

    revalidateTag("authors")

    return {
      isSuccess: true,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
