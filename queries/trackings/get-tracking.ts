import { http } from "@/lib/http"

import "server-only"

import {
  type Supplier,
  type Tracking,
  type WarehouseTrackingInventory,
} from "@/lib/types/models"

import { auth } from "../auth"

const getTracking = async (
  trackingId: number
): Promise<
  | (Tracking & {
      supplier: Supplier
      warehouseTrackingInventory: WarehouseTrackingInventory
    })
  | null
> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<
      Tracking & {
        supplier: Supplier
        warehouseTrackingInventory: WarehouseTrackingInventory
      }
    >(`/api/management/warehouse-trackings/${trackingId}`, {
      next: {
        tags: ["trackings"],
      },
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })
    return data
  } catch {
    return null
  }
}

export default getTracking
