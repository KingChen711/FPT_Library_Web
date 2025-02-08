"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TMutateSupplierSchema } from "@/lib/validations/suppliers/mutate-supplier"

export async function updateSupplier(
  supplierId: number,
  body: TMutateSupplierSchema
): Promise<ActionResponse<string>> {
  try {
    const { getAccessToken } = auth()
    const { message } = await http.put(
      `/api/management/suppliers/${supplierId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidatePath("/management/suppliers")

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
