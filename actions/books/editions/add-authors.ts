"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TBookEditionAddAuthorsSchema } from "@/lib/validations/books/book-editions/add-authors"

export async function addAuthors({
  authorIds,
  bookId,
}: TBookEditionAddAuthorsSchema & {
  bookId: number
}): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()
  try {
    const { message } = await http.post(
      `/api/management/library-items/add-range-author`,
      { authorIds, libraryItemId: bookId },
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
