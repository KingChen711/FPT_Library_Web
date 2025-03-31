import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import {
  type BorrowRequest,
  type BorrowRequestResource,
} from "@/lib/types/models"

export type BorrowRequestDetail = BorrowRequest & {
  isExistPendingResources: boolean
  borrowRequestResources: BorrowRequestResource[]
}

function useBorrowRequestDetail(borrowRequestId: number) {
  console.log(`/api/users/borrows/requests/${borrowRequestId}`)
  console.log(`/api/users/borrows/requests/${borrowRequestId}`)

  const { accessToken } = useAuth()
  return useQuery({
    queryKey: [`/borrows/requests/${borrowRequestId}`],
    queryFn: async () => {
      try {
        const { data } = await http.get<BorrowRequestDetail | null>(
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
