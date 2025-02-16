"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TMutateTrackingDetailSchema } from "@/lib/validations/trackings/edit-tracking-detail"

export async function addTrackingDetail(
  trackingId: number,
  body: TMutateTrackingDetailSchema
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()
  try {
    const { message } = await http.post(
      `/api/management/warehouse-trackings/${trackingId}/details`,
      body,
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
