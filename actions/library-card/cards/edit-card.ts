"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TEditCardSchema } from "@/lib/validations/patrons/cards/edit-card"

export async function editCard(
  userId: string,
  libraryCardId: string,
  body: TEditCardSchema
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()
  try {
    const { message } = await http.put(
      `/api/management/library-cards/${libraryCardId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidatePath("/management/library-card-holders")
    revalidatePath(`/management/library-card-holders/${userId}`)

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
