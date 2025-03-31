// /api/management/reservations/assignable-after-return?libraryItemInstanceIds=21

import { http } from "@/lib/http"

import "server-only"

import {
  type Author,
  type BookEdition,
  type Category,
  type ConditionHistory,
  type LibraryItemInstance,
  type LibraryItemInventory,
  type ReservationQueueManagement,
  type Shelf,
} from "@/lib/types/models"

import { auth } from "../auth"

export type ReservationQueues = (ReservationQueueManagement & {
  libraryItemInstance: LibraryItemInstance & {
    libraryItemConditionHistories: ConditionHistory[]
  }
  libraryItem: BookEdition & {
    libraryItemInventory: LibraryItemInventory
    authors: Author[]
    shelf: Shelf | null
    category: Category
  }
})[]

const checkAssignable = async (
  libraryItemInstanceIds: number[]
): Promise<ReservationQueues> => {
  const { getAccessToken } = auth()

  if (libraryItemInstanceIds.length === 0) return []

  try {
    const { data } = await http.get<ReservationQueues>(
      `/api/management/reservations/assignable-after-return?${libraryItemInstanceIds.map((id) => `libraryItemInstanceIds=${id}`).join("&")}`,
      {
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

export default checkAssignable
