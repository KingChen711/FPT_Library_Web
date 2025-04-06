import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import {
  type Condition,
  type ConditionHistory,
  type Floor,
  type LibraryItemInstance,
  type Section,
  type Shelf,
  type Zone,
} from "@/lib/types/models"

type AssignableItem = {
  libraryItemInstance: LibraryItemInstance & {
    libraryItemConditionHistories: (ConditionHistory & {
      condition: Condition
    })[]
  }
  shelfDetail: {
    floor: Floor
    zone: Zone
    section: Section
    libraryShelf: Shelf
  }
}

function useAssignableItems(reservationId: number, enabled: boolean) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: [`assignable-items`, reservationId],
    queryFn: async (): Promise<AssignableItem[]> => {
      try {
        const { data } = await http.get<AssignableItem[]>(
          `/api/management/reservations/${reservationId}/get-assignable-instances`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        return data || []
      } catch {
        return []
      }
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    enabled,
  })
}

export default useAssignableItems
