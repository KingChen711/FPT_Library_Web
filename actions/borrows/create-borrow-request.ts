"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

type TBorrowRequest = {
  description: string
  libraryItemIds: number[]
  reservationItemIds: number[]
}

export async function createBorrowRequest(
  body: TBorrowRequest
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()
  try {
    const { message } = await http.post("/api/borrows/requests", body, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })

    revalidatePath("/borrows")
    revalidateTag("check-available-borrow-request")

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
