"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function softDeleteEdition(
  bookId: number,
  editionId: number
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()
  try {
    const { message } = await http.patch(
      `/api/management/books/editions/${editionId}/soft-delete`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidatePath("/management/books")
    revalidatePath(`/management/books/${bookId}`)
    revalidatePath(`/management/books/${bookId}/editions/${editionId}`)

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    console.log(error)

    return handleHttpError(error)
  }
}
