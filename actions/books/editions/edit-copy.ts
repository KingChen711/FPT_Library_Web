"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type EBookCopyStatus } from "@/lib/types/enums"

export async function editCopy({
  bookId,
  copyId,
  status,
  barcode,
}: {
  bookId: number
  barcode: string
  copyId: number
  status: EBookCopyStatus
}): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()
  try {
    const { message } = await http.put(
      `/api/management/library-items/instances/${copyId}`,
      { status, barcode },
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
