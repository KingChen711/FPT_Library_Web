import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useLocale } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { handleHttpError, http } from "@/lib/http"
import { type LibraryItem } from "@/lib/types/models"

type TData = {
  alreadyRequestedItems: LibraryItem[] | []
  alreadyBorrowedItems: LibraryItem[] | []
  alreadyReservedItems: LibraryItem[] | []
  allowToReserveItems: LibraryItem[] | []
  allowToBorrowItems: LibraryItem[] | []
}

const defaultValue: TData = {
  allowToBorrowItems: [],
  alreadyBorrowedItems: [],
  alreadyReservedItems: [],
  allowToReserveItems: [],
  alreadyRequestedItems: [],
}

function useCheckAvailableBorrowRequest(
  libraryItemIds: number[],
  enabled = true
  // onFail = () => {}
) {
  const { accessToken } = useAuth()
  const locale = useLocale()
  return useQuery({
    queryKey: [`check-available-borrow-request`, libraryItemIds, accessToken],
    queryFn: async () => {
      if (!libraryItemIds || libraryItemIds.length === 0 || !accessToken)
        return defaultValue
      try {
        const { data } = await http.get<TData>(
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

        return data || defaultValue
      } catch (error) {
        const handledError = handleHttpError(error)

        // onFail()
        handleServerActionError(handledError, locale)
        return defaultValue
      }
    },
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    enabled,
  })
}

export default useCheckAvailableBorrowRequest
