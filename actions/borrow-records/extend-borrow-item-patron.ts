"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function extendBorrowItemPatron(
  recordDetailId: number,
  recordId: number
): Promise<ActionResponse<string>> {
  console.log("extendBorrowItemPatron")

  const { getAccessToken } = auth()
  try {
    const { message } = await http.put(
      `/api/borrows/records/${recordId}/extend/${recordDetailId}`,
      { borrowRecordDetailIds: [recordDetailId] },
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidatePath("/me/account/borrow")
    revalidatePath(`/me/account/borrow/record/${recordId}`)

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
