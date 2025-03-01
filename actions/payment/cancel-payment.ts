"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TCancelPaymentSchema } from "@/lib/validations/payment/cancel-payment"

export async function cancelPayment(
  body: TCancelPaymentSchema
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()
  console.log(body)

  try {
    const { message } = await http.post(
      `/api/payment/cancel/${body.paymentLinkId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidatePath("/management/library-card-holders")

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    console.log(error)

    return handleHttpError(error)
  }
}
