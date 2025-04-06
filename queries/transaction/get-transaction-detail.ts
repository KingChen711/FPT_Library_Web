import { http } from "@/lib/http"
import {
  type BookResource,
  type CurrentUser,
  type Fine,
  type Package,
  type PaymentMethod,
  type Transaction,
} from "@/lib/types/models"

import { auth } from "../auth"

export type Fines = Fine[]

export type TGetTransactionData = Transaction & {
  qrCode: string
  user: CurrentUser | null
  fine: Fine | null
  libraryResource: BookResource | null
  libraryCardPackage: Package | null
  paymentMethod: PaymentMethod | null
  borrowRequestResources: []
}

type Props = {
  transactionId: number
}

const getTransactionDetail = async ({
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

export default getTransactionDetail
