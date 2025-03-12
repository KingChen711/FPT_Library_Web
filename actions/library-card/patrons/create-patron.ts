///api/management/library-card-holders
"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TCreatePatronSchema } from "@/lib/validations/patrons/create-patron"

export type PaymentData = {
  description: string
  orderCode: string
  qrCode: string
  expiredAt: Date | null
  paymentLinkId: string
}

export async function createPatron(
  body: TCreatePatronSchema
): Promise<
  ActionResponse<{ message: string; paymentData: PaymentData | null }>
> {
  const { getAccessToken } = auth()
  try {
    const { message, data } = await http.post<{
      payOsResponse: { data: PaymentData | null }
      expiredAtOffsetUnixSeconds: number
    }>(`/api/management/library-card-holders`, body, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })

    revalidatePath("/management/library-card-holders")

    return {
      isSuccess: true,
      data: {
        message,
        paymentData: data?.payOsResponse?.data
          ? {
              description: data.payOsResponse.data.description,
              orderCode: data.payOsResponse.data.orderCode,
              paymentLinkId: data.payOsResponse.data.paymentLinkId,
              qrCode: data.payOsResponse.data.qrCode,
              expiredAt: data.expiredAtOffsetUnixSeconds
                ? new Date(data.expiredAtOffsetUnixSeconds * 1000)
                : null,
            }
          : null,
      },
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
