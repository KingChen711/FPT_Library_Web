"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TExtendCardBorrowAmountSchema } from "@/lib/validations/patrons/cards/extend-card-borrow-amount"

export async function extendCardBorrowAmount(
  userId: string,
  body: TExtendCardBorrowAmountSchema
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()

  try {
    const { message } = await http.patch(
      `/api/management/library-cards/${body.libraryCardId}/extend-borrow-amount`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        searchParams: {
          reason: body.reason,
          maxItemOnceTime: body.maxItemOnceTime,
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
