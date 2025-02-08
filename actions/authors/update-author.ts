"use server"

import { revalidateTag } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TMutateAuthorSchema } from "@/lib/validations/author/mutate-author"

export async function updateAuthor(
  userId: number,
  body: TMutateAuthorSchema
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()

  console.log("🚀 ~ body:", body)
  try {
    const { message } = await http.put(
      `/api/management/authors/${userId}`,
      body,
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
