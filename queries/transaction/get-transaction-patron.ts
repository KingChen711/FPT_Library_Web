import { http } from "@/lib/http"
import {
  type BookResource,
  type Fine,
  type FineBorrow,
  type Package,
  type PaymentMethod,
  type Transaction,
  type User,
} from "@/lib/types/models"

import { auth } from "../auth"

export type Fines = Fine[]

export type TGetTransactionData = Transaction & {
  qrCode: string
  libraryCardPackage: Package | null
  paymentMethod: PaymentMethod | null
  borrowRequestResources: []

  user: User
  libraryResource: BookResource | null
  fine: (FineBorrow & { finePolicy: Fine }) | null
}

type Props = {
  transactionId: number
}

const getTransactionPatron = async ({
  transactionId,
}: Props): Promise<TGetTransactionData | null> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<TGetTransactionData | null>(
      `/api/users/transactions/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    return data
  } catch {
    return null
  }
}

export default getTransactionPatron
