"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TSuspendCardSchema } from "@/lib/validations/patrons/cards/suspend-card"

export async function suspendCard(
  userId: string,
  body: TSuspendCardSchema
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()

  try {
    const { message } = await http.patch(
      `/api/management/library-cards/${body.libraryCardId}/suspend`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        searchParams: {
          reason: body.reason,
          suspensionEndDate: new Date(body.suspensionEndDate).toISOString(),
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
