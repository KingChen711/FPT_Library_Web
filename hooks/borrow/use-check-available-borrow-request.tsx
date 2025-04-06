import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type LibraryItem } from "@/lib/types/models"

type TData = {
  alreadyRequestedItems: LibraryItem[] | []
  alreadyBorrowedItems: LibraryItem[] | []
  alreadyReservedItems: LibraryItem[] | []
  allowToReserveItems: LibraryItem[] | []
  allowToBorrowItems: LibraryItem[] | []
}

function useCheckAvailableBorrowRequest(libraryItemIds: number[]) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: [`check-available-borrow-request`, libraryItemIds],
    queryFn: async () => {
      try {
        const { data } = await http.get<TData | null>(
          `/api/library-items/unavailable`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            searchParams: {
              ids: libraryItemIds,
            },
          }
        )

        return data
      } catch {
        return null
      }
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  })
}

export default useCheckAvailableBorrowRequest
