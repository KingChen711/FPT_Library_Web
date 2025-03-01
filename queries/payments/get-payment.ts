import "server-only"

import { http } from "@/lib/http"

import { auth } from "../auth"

export async function getPayment(paymentLinkId: string): Promise<unknown> {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<unknown>(`/api/payment/${paymentLinkId}`, {
      next: {
        tags: [`payment-${paymentLinkId}`],
      },
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })
    return data
  } catch {
    return []
  }
}
