"use server"

import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type LibraryCardTransaction } from "@/lib/types/models"

export async function createLibraryCardTransaction(body: {
  libraryCardPackageId: number
  resourceId: null
  description: null
  paymentMethodId: number
  transactionType: number
}): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()

  try {
    const { data } = await http.post<LibraryCardTransaction>(
      "/api/payment/transactions",
      body,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    return {
      isSuccess: true,
      data: data.data.checkoutUrl,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
