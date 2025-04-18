/* eslint-disable @typescript-eslint/ban-ts-comment */
import { http } from "@/lib/http"

import "server-only"

import { type ReservationQueue } from "@/lib/types/models"

import { auth } from "../auth"

// export type ReservationDetail = ReservationQueueManagement & {
//   libraryItem: BookEdition & {
//     shelf: Shelf | null
//     category: Category
//     authors: Author[]
//     libraryItemInstances: LibraryItemInstance[]
//   }
//   libraryCard: LibraryCard
//   libraryItemInstance: LibraryItemInstance
//   borrowRequest: BorrowRequest
// }

const getBorrowReservationPatron = async (
  reservationId: number
): Promise<ReservationQueue | null> => {
  const { getAccessToken } = auth()

  try {
    const { data } = await http.get<ReservationQueue>(
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
