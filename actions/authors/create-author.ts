"use server"

import { revalidateTag } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TMutateAuthorSchema } from "@/lib/validations/author/mutate-author"

export async function createAuthor(
  body: TMutateAuthorSchema
): Promise<ActionResponse> {
  const { getAccessToken } = auth()

  try {
    await http.post("/api/management/authors", body, {
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
