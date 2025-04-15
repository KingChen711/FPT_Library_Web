"use server"

import { auth } from "@/queries/auth"
import { type TTrackingDetailItems } from "@/queries/trackings/get-tracking-details"

import { http } from "@/lib/http"

export async function getExportTrackingDetails(
  trackingId: number
): Promise<TTrackingDetailItems | null> {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<TTrackingDetailItems>(
      `/api/management/warehouse-trackings/${trackingId}/details`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        searchParams: {
          pageSize: 1000,
        },
      }
    )

    return data || null
  } catch {
    return null
  }
}
