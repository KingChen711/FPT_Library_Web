/* eslint-disable @typescript-eslint/ban-ts-comment */
import { http } from "@/lib/http"

import "server-only"

import {
  type Category,
  type Supplier,
  type Tracking,
  type TrackingDetail,
} from "@/lib/types/models"

import { auth } from "../auth"

export type TrackingDetailCatalog = TrackingDetail & {
  category: Category
  warehouseTracking: Tracking & { supplier: Supplier }
}

const getTrackingDetail = async (
  trackingDetailId: number
): Promise<TrackingDetailCatalog | null> => {
  const { getAccessToken } = auth()

  try {
    const { data } = await http.get<{
      warehouseTrackingDetail: TrackingDetailCatalog
    }>(`/api/management/warehouse-trackings/details/${trackingDetailId}`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })

    return data?.warehouseTrackingDetail || null
  } catch {
    return null
  }
}

export default getTrackingDetail
