import { http } from "@/lib/http"

import "server-only"

import {
  type Author,
  type BookEdition,
  type Category,
  type LibraryItemAuthor,
  type TrackingDetail,
  type WarehouseTrackingInventory,
} from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"

import { auth } from "../auth"

export type TrackingDetails = (TrackingDetail & {
  libraryItem:
    | (BookEdition & {
        libraryItemAuthors: (LibraryItemAuthor & { author: Author })[]
        category: Category
      })
    | null
  category: Category
})[]

type Response = {
  result: Pagination<TrackingDetails>
  statisticSummary: WarehouseTrackingInventory
  statistics: {
    category: Category
    totalItem: number
    totalInstanceItem: number
    totalCatalogedItem: number
    totalCatalogedInstanceItem: number
    totalPrice: number
  }[]
}

const defaultResponse: Response = {
  result: {
    sources: [],
    pageIndex: 1,
    pageSize: 10,
    totalActualItem: 0,
    totalPage: 0,
  },
  statisticSummary: {
    totalCatalogedInstanceItem: 0,
    totalCatalogedItem: 0,
    totalInstanceItem: 0,
    totalItem: 0,
    trackingId: 0,
  },
  statistics: [],
}

const getTrackingDetails = async (trackingId: number): Promise<Response> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<Response>(
      `/api/management/warehouse-trackings/${trackingId}/details`,
      {
        next: {
          tags: ["trackingDetails"],
        },
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        searchParams: {
          pageSize: 100,
        },
      }
    )

    return data || defaultResponse
  } catch {
    return defaultResponse
  }
}

export default getTrackingDetails
