import { useAuth } from "@/contexts/auth-provider"
import { useMutation } from "@tanstack/react-query"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import {
  type LibraryItemInstance,
  type ReservationQueue,
} from "@/lib/types/models"

export type AssignedReservations = {
  reservationCode: string
  fullName: string
  cardBarcode: string
  assignedDate: Date
  reservationQueue: ReservationQueue & {
    libraryItemInstance: LibraryItemInstance
  }
}[]

function useAssignItems() {
  const { accessToken } = useAuth()

  return useMutation({
    mutationFn: async (
      libraryItemInstanceIds: number[]
    ): Promise<
      ActionResponse<{
        message: string
        assignedReservation: AssignedReservations
      }>
    > => {
      try {
        const { message, data } = await http.post<AssignedReservations>(
          "/api/management/reservations/assign-after-return",
          { libraryItemInstanceIds },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        return {
          isSuccess: true,
          data: { message, assignedReservation: data || [] },
        }
      } catch (error) {
        return handleHttpError(error)
      }
    },
  })
}

export default useAssignItems
