"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TRejectCardSchema } from "@/lib/validations/patrons/cards/reject-card"

export async function rejectCard(
  userId: string,
  body: TRejectCardSchema
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()

  try {
    const { message } = await http.patch(
      `/api/management/library-cards/${body.libraryCardId}/reject`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        searchParams: {
          rejectReason: body.rejectReason,
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
