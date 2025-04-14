import { http } from "@/lib/http"

import "server-only"

import { format } from "date-fns"

import { type Transaction, type User } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchTransactionsSchema } from "@/lib/validations/transactions/search-transaction"

import { auth } from "../auth"

export type Transactions = (Transaction & {
  user: User
})[]

const getTransactions = async (
  searchParams: TSearchTransactionsSchema
): Promise<Pagination<Transactions>> => {
  const { getAccessToken } = auth()
  try {
    const formatDate = (d: Date) => format(d, "yyyy-MM-dd")
    const { data } = await http.get<Pagination<Transactions>>(
      `/api/management/transactions`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        searchParams: {
          ...searchParams,

          amountRange:
            JSON.stringify(searchParams.amountRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.amountRange.map((a) => (a === null ? "null" : a)),

          transactionDateRange:
            JSON.stringify(searchParams.transactionDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.transactionDateRange.map((d) =>
                  d === null ? "" : formatDate(new Date(d))
                ),
          expiredAtRange:
            JSON.stringify(searchParams.expiredAtRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.expiredAtRange.map((d) =>
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

    return data
  } catch {
    return {
      sources: [],
      pageIndex: searchParams.pageIndex,
      pageSize: +searchParams.pageSize,
      totalActualItem: 0,
      totalPage: 0,
    }
  }
}

export default getTransactions
