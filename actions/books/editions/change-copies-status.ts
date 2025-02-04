"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type LibraryItemInstance } from "@/lib/types/models"

export async function changeCopiesStatus({
  bookId,
  bookEditionCopies,
}: {
  bookId: number
  bookEditionCopies: LibraryItemInstance[]
}): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()
  try {
    const { message } = await http.put(
      `/api/management/library-items/${bookId}/instances`,
      { libraryItemInstances: bookEditionCopies },
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
