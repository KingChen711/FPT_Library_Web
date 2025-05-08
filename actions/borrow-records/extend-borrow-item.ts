"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function extendBorrowItem(
  recordDetailId: number,
  recordId: number
): Promise<ActionResponse<string>> {
  console.log("extendBorrowItem")

  const { getAccessToken } = auth()
  try {
    const { message } = await http.put(
      `/api/management/borrows/records/${recordId}/extend/${recordDetailId}`,
      { borrowRecordDetailIds: [recordDetailId] },
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidatePath("/management/borrows/records")
    revalidatePath(`/management/borrows/records/${recordId}`)

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
