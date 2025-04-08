/* eslint-disable @typescript-eslint/ban-ts-comment */
import { http } from "@/lib/http"

import "server-only"

import {
  type Author,
  type BookEdition,
  type Category,
  type LibraryCard,
  type LibraryItemInstance,
  type ReservationQueueManagement,
  type Shelf,
} from "@/lib/types/models"

import { auth } from "../auth"

export type ReservationDetail = ReservationQueueManagement & {
  libraryItem: BookEdition & {
    shelf: Shelf | null
    category: Category
    authors: Author[]
    libraryItemInstances: LibraryItemInstance[]
  }
  libraryCard: LibraryCard
  libraryItemInstance: LibraryItemInstance
}

const getBorrowReservationPatron = async (
  reservationId: number
): Promise<ReservationDetail | null> => {
  const { getAccessToken } = auth()

  try {
    const { data } = await http.get<ReservationDetail>(
      `/api/users/reservations/${reservationId}`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    return data || null
  } catch {
    return null
  }
}

export default getBorrowReservationPatron
