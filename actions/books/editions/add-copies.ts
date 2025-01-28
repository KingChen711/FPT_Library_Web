"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TBookEditionAddCopiesSchema } from "@/lib/validations/books/book-editions/add-copies"

export async function addCopies({
  bookEditionCopies,
  bookId,
}: TBookEditionAddCopiesSchema & {
  bookId: number
}): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()
  try {
    const { message } = await http.post(
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
