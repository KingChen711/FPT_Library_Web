"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type ETrackingStatus } from "@/lib/types/enums"

export async function changeTrackingStatus(
  trackingId: number,
  status: ETrackingStatus,
  supplementRequest: boolean
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()
  try {
    const { message } = await http.patch(
      supplementRequest
        ? `/api/management/warehouse-trackings/${trackingId}/supplement-status?status=${status}`
        : `/api/management/warehouse-trackings/${trackingId}/status?status=${status}`,
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
    return handleHttpError(error)
  }
}
