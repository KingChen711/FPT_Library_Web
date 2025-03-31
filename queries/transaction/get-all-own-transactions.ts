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

import { auth } from "../auth"

export type Fines = Fine[]

export type TGetAllTransactionData = Transaction & {
  qrCode: string
  user: CurrentUser | null
  fine: Fine | null
  libraryResource: BookResource | null
  libraryCardPackage: Package | null
  paymentMethod: PaymentMethod | null
  borrowRequestResources: []
}

const getAllOwnTransactions = async (): Promise<
  Pagination<TGetAllTransactionData[]>
> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<Pagination<TGetAllTransactionData[]>>(
      `/api/users/transactions`,
      {
        next: {
          tags: ["/get-all-own-transactions"],
        },
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
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
}

export default getAllOwnTransactions
