import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import {
  type BookResource,
  type BorrowRequest,
  type DigitalBorrow,
  type DigitalTransaction,
} from "@/lib/types/models"

export type DigitalBorrowDetail = DigitalBorrow & {
  libraryResource: BookResource
  transactions: DigitalTransaction[]
}

function useBorrowRequestDetail(borrowRequestId: number) {
  console.log(`/api/users/borrows/requests/${borrowRequestId}`)
  console.log(`/api/users/borrows/requests/${borrowRequestId}`)

  const { accessToken } = useAuth()
  return useQuery({
    queryKey: [`/borrows/requests/${borrowRequestId}`],
    queryFn: async () => {
      try {
        const { data } = await http.get<BorrowRequest | null>(
          `/api/users/borrows/requests/${borrowRequestId}`,
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

export default useBorrowRequestDetail
