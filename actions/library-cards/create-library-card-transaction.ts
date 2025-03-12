"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

type PaymentData = {
  description: string
  orderCode: string
  qrCode: string
  expiredAt: Date | null
  paymentLinkId: string
}

export async function createLibraryCardTransaction(body: {
  libraryCardPackageId: number
  resourceId: null
  description: null
  paymentMethodId: number
  transactionType: number
}): Promise<
  ActionResponse<{ message: string; paymentData: PaymentData | null }>
> {
  const { getAccessToken } = auth()

  try {
    const { data, message } = await http.post<{
      payOsResponse: { data: PaymentData }
      expiredAtOffsetUnixSeconds: number
    }>("/api/payment/transactions", body, {
      headers: { Authorization: `Bearer ${getAccessToken()}` },
    })

    revalidatePath(
      `/me/account/library-card/register?libraryCardId=${body.libraryCardPackageId}`
    )
    revalidatePath(`/me/account/library-card`)

    return {
      isSuccess: true,
      data: {
        message,
        paymentData: {
          description: data.payOsResponse.data.description,
          orderCode: data.payOsResponse.data.orderCode,
          paymentLinkId: data.payOsResponse.data.paymentLinkId,
          qrCode: data.payOsResponse.data.qrCode,
          expiredAt: data.expiredAtOffsetUnixSeconds
            ? new Date(data.expiredAtOffsetUnixSeconds * 1000)
            : null,
        },
      },
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
