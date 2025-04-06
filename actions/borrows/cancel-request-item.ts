"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function cancelRequestItem(
  requestId: number,
  libraryItemId: number,
  libraryCardId: string
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()
  try {
    const { message } = await http.patch(
      `/api/management/borrows/requests/${requestId}/details/${libraryItemId}/cancel?libraryCardId=${libraryCardId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidatePath(`/management/borrows/requests`)
    revalidatePath(`/management/borrows/requests/${requestId}`)

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
