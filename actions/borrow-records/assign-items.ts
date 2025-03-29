"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import {
  type LibraryItemInstance,
  type ReservationQueue,
} from "@/lib/types/models"

export type AssignItemsResponse = {
  reservationCode: "RS-20250329-0001"
  fullName: "King Chen"
  cardBarcode: "EC-36CBCCF417D5"
  assignedDate: "2025-03-29T17:32:03.6004146"
  reservationQueue: ReservationQueue & {
    libraryItemInstance: LibraryItemInstance
  }
}[]

export async function assignItems(
  libraryItemInstanceIds: number[]
): Promise<
  ActionResponse<{ message: string; assignedReservation: AssignItemsResponse }>
> {
  const { getAccessToken } = auth()
  try {
    const { message, data } = await http.post<AssignItemsResponse>(
      "/api/management/reservations/assign-after-return",
      { libraryItemInstanceIds },
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidatePath("/management/borrows/records")

    return {
      isSuccess: true,
      data: { message, assignedReservation: data },
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
