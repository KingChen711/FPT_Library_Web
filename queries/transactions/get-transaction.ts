import { http } from "@/lib/http"

import "server-only"

import {
  type BookResource,
  type Fine,
  type FineBorrow,
  type Package,
  type Transaction,
  type User,
} from "@/lib/types/models"

import { auth } from "../auth"

export type TTransactionDetail = Transaction & {
  user: User
  libraryResource: BookResource | null
  libraryCardPackage: Package | null
  fine: (FineBorrow & { finePolicy: Fine }) | null
}

const getTransaction = async (
  transactionId: number
): Promise<TTransactionDetail | null> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<TTransactionDetail>(
      `/api/management/transactions/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )
    return data || null
  } catch {
    return null
  }
}

export default getTransaction
