import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import {
  type BookResource,
  type DigitalBorrow,
  type DigitalTransaction,
} from "@/lib/types/models"

export type DigitalBorrowDetail = DigitalBorrow & {
  libraryResource: BookResource
  transactions: DigitalTransaction[]
}

function useBorrowDigitalDetail(digitalBorrow: number) {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: [`digital-borrows/${digitalBorrow}`, accessToken],
    queryFn: async () => {
      try {
        const { data } = await http.get<DigitalBorrowDetail | null>(
          `/api/users/borrows/digital/${digitalBorrow}`,
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

export default useBorrowDigitalDetail
