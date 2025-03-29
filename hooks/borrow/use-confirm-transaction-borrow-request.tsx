import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type BorrowRequestResource } from "@/lib/types/models"

function useConfirmTransactionBorrowRequest(borrowRequestId: number) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: [
      `/borrow/requests/${borrowRequestId}/confirm-transaction`,
      borrowRequestId,
    ],
    queryFn: async () => {
      try {
        const { data } = await http.get<BorrowRequestResource[] | null>(
          `/api/borrows/requests/${borrowRequestId}/confirm-transaction`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
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

export default useConfirmTransactionBorrowRequest
