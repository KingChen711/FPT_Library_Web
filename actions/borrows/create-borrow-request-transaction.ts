"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

type PaymentData = {
  description: string
  orderCode: string
  qrCode: string
  expiredAt: Date
  paymentLinkId: string
}

export async function createBorrowRequestTransaction(
  borrowRequestId: number
): Promise<
  ActionResponse<{ message: string; paymentData: PaymentData | null }>
> {
  const isProduction = process.env.NODE_ENV === "production"
  const { getAccessToken } = auth()
  try {
    const { data, message } = await http.post<{
      payOsResponse: { data: PaymentData }
      expiredAtOffsetUnixSeconds: number
    }>(
      `/api/payment/transactions/borrows/requests/${borrowRequestId}`,
      {},
      {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
      }
    )

    revalidatePath(`/me/account/borrow/request/${borrowRequestId}`)
    revalidatePath(`/me/account/borrow`)

    return {
      isSuccess: true,
      data: {
        message,
        paymentData: {
          description: data.payOsResponse.data.description,
          orderCode: data.payOsResponse.data.orderCode,
          paymentLinkId: data.payOsResponse.data.paymentLinkId,
          qrCode: data.payOsResponse.data.qrCode,
          expiredAt: isProduction
            ? new Date(
                data.expiredAtOffsetUnixSeconds * 1000 - 1000 * 60 * 60 * 0
              )
            : new Date(data.expiredAtOffsetUnixSeconds * 1000),
        },
      },
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
