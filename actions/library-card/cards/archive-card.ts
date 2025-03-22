"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TArchiveCardSchema } from "@/lib/validations/patrons/cards/archive-card"

export async function archiveCard(
  userId: string,
  body: TArchiveCardSchema
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()

  try {
    const { message } = await http.put(
      `/api/management/library-cards/${userId}/archive-card`,
      body,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidatePath("/management/library-card-holders")
    revalidatePath(`/management/library-card-holders/${userId}`)
    revalidatePath(`/management/library-cards`)
    revalidatePath(`/management/library-cards/${body.libraryCardId}`)

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
