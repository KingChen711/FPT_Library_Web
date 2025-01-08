"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type EBookCopyStatus } from "@/lib/types/enums"

export async function changeCopyStatus({
  bookId,
  copyId,
  editionId,
  status,
}: {
  bookId: number
  editionId: number
  copyId: number
  status: EBookCopyStatus
}): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()
  try {
    const { message } = await http.put(
      `/api/management/books/editions/copies/${copyId}`,
      { status },
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
    return handleHttpError(error)
  }
}
