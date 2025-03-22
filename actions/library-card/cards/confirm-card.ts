"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function confirmCard(
  libraryCardId: string,
  userId: string
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()

  try {
    const { message } = await http.patch(
      `/api/management/library-cards/${libraryCardId}/confirm`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidatePath("/management/library-card-holders")
    revalidatePath(`/management/library-card-holders/${userId}`)
    revalidatePath(`/management/library-cards`)
    revalidatePath(`/management/library-cards/${libraryCardId}`)

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
