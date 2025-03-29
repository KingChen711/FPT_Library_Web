import { useAuth } from "@/contexts/auth-provider"
import { useQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import {
  type BookResource,
  type CurrentUser,
  type Fine,
  type Package,
  type PaymentMethod,
  type Transaction,
} from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"

export type TGetAllTransactionData = Transaction & {
  qrCode: string
  user: CurrentUser | null
  fine: Fine | null
  libraryResource: BookResource | null
  libraryCardPackage: Package | null
  paymentMethod: PaymentMethod | null
  borrowRequestResources: []
}

function useGetOwnTransactions() {
  const { accessToken } = useAuth()
  return useQuery({
    queryKey: ["get-own-transactions", accessToken],
    queryFn: async () => {
      try {
        const { data } = await http.get<Pagination<TGetAllTransactionData[]>>(
          `/api/users/transactions`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        return (
          data || {
            sources: [],
            pageIndex: 0,
            pageSize: 0,
            totalActualItem: 0,
            totalPage: 0,
          }
        )
      } catch {
        return {
          sources: [],
          pageIndex: 0,
          pageSize: 0,
          totalPage: 0,
          totalActualItem: 0,
        }
      }
    },
  })
}

export default useGetOwnTransactions
