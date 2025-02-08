import { http } from "@/lib/http"

import "server-only"

import { type LibraryItem, type TrackingDetail } from "@/lib/types/models"

import { auth } from "../auth"

export type TrackingDetails = (TrackingDetail & {
  libraryItem: LibraryItem | null
})[]

const getTrackingDetails = async (
  trackingId: number
): Promise<TrackingDetails> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<TrackingDetails>(
      `/api/management/warehouse-trackings/${trackingId}/details`,
      {
        next: {
          tags: ["trackingDetails"],
        },
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    return data || []
  } catch {
    return []
  }
}

export default getTrackingDetails
