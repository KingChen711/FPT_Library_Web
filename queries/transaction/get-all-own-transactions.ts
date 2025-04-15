import { format } from "date-fns"

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
import { type TSearchTransactionsSchema } from "@/lib/validations/transactions/search-transactions"

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

const getAllOwnTransactions = async (
  searchParams: TSearchTransactionsSchema
): Promise<Pagination<TGetAllTransactionData[]>> => {
  const { getAccessToken } = auth()

  const formatDate = (d: Date) => format(d, "yyyy-MM-dd")

  try {
    const { data } = await http.get<Pagination<TGetAllTransactionData[]>>(
      `/api/users/transactions`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        searchParams: {
          ...searchParams,
          search: searchParams.searchTransaction.trim(),
          amountRange:
            JSON.stringify(searchParams.amountRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.amountRange.map((d) => (d === null ? "" : d)),
          transactionDateRange:
            JSON.stringify(searchParams.transactionDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.transactionDateRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
          expirationDateRange:
            JSON.stringify(searchParams.expirationDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.expirationDateRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
          cancelledAtRange:
            JSON.stringify(searchParams.cancelledAtRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.cancelledAtRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
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
