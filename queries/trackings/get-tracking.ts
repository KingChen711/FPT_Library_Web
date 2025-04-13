import { http } from "@/lib/http"

import "server-only"

import {
  type Supplier,
  type Tracking,
  type WarehouseTrackingInventory,
} from "@/lib/types/models"

import { auth } from "../auth"

export type TTrackingDetail = Tracking & {
  supplier: Supplier
  warehouseTrackingInventory: WarehouseTrackingInventory
}

const getTracking = async (
  trackingId: number
): Promise<TTrackingDetail | null> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<TTrackingDetail>(
      `/api/management/warehouse-trackings/${trackingId}`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )
    return data
  } catch {
    return null
  }
}

export default getTracking
