"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function addFinalizedStockInFile(
  trackingId: number,
  url: string
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()
  try {
    const { message } = await http.patch(
      `/api/management/warehouse-trackings/${trackingId}/add-stock-in-file?url=${url}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidatePath("/management/trackings")
    revalidatePath(`/management/trackings/${trackingId}`)

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    console.log({ error })

    return handleHttpError(error)
  }
}
