import { http } from "@/lib/http"

import "server-only"

import { format } from "date-fns"

import {
  type Supplier,
  type Tracking,
  type WarehouseTrackingInventory,
} from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchTrackingsSchema } from "@/lib/validations/trackings/search-trackings"

import { auth } from "../auth"

export type Trackings = (Tracking & {
  supplier: Supplier
  warehouseTrackingInventory: WarehouseTrackingInventory
})[]

const getTrackings = async (
  searchParams: TSearchTrackingsSchema
): Promise<Pagination<Trackings>> => {
  const { getAccessToken } = auth()
  try {
    const formatDate = (d: Date) => format(d, "yyyy-MM-dd")
    const { data } = await http.get<Pagination<Trackings>>(
      `/api/management/warehouse-trackings`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        searchParams: {
          ...searchParams,
          totalItemRange:
            JSON.stringify(searchParams.totalItemRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.totalItemRange.map((a) =>
                  a === null ? "null" : a
                ),
          totalAmountRange:
            JSON.stringify(searchParams.totalAmountRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.totalAmountRange.map((a) =>
                  a === null ? "null" : a
                ),
          entryDateRange:
            JSON.stringify(searchParams.entryDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.entryDateRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
          expectedReturnDateRange:
            JSON.stringify(searchParams.expectedReturnDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.expectedReturnDateRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
          actualReturnDateRange:
            JSON.stringify(searchParams.actualReturnDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.actualReturnDateRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
          createdAtRange:
            JSON.stringify(searchParams.createdAtRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.createdAtRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
          updatedAtRange:
            JSON.stringify(searchParams.updatedAtRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.updatedAtRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
        },
      }
    )

    return data
  } catch {
    return {
      sources: [],
      pageIndex: searchParams.pageIndex,
      pageSize: +searchParams.pageSize,
      totalActualItem: 0,
      totalPage: 0,
    }
  }
}

export default getTrackings
