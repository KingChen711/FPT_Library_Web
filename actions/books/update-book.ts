"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TEditBookSchema } from "@/lib/validations/books/edit-book"

export async function updateBook(
  bookId: number,
  body: TEditBookSchema
): Promise<ActionResponse<string>> {
  try {
    const { getAccessToken } = auth()
    const { message } = await http.put(
      `/api/management/library-items/${bookId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidatePath("/management/books")
    revalidatePath(`/management/books/${bookId}`)

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
