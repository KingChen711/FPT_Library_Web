"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function assignItem(
  reservationId: number,
  instanceId: number
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()
  try {
    const { message } = await http.post(
      `/api/management/reservations/${reservationId}/assign?libraryItemInstanceId=${instanceId}`,
      { libraryItemInstanceIds: [instanceId] },
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidatePath(`/management/borrows/reservation`)
    revalidatePath(`/management/borrows/reservation/${reservationId}`)

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
