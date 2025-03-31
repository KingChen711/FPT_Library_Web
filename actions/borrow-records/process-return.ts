"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TProcessReturnSchema } from "@/lib/validations/borrow-records/process-return"

export async function processReturn(body: TProcessReturnSchema): Promise<
  ActionResponse<{
    message: string
    returnItemInstanceIds: number[]
  }>
> {
  const { getAccessToken } = auth()
  try {
    const { message, data } = await http.put<{
      returnItemInstanceIds: number[]
    }>("/api/mangement/borrows/records/process-return", body, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })

    revalidatePath("/management/borrows/records")

    return {
      isSuccess: true,
      data: {
        message,
        returnItemInstanceIds: data?.returnItemInstanceIds || [],
      },
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
