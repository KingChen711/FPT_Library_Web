"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TMutateClosureDaySchema } from "@/lib/validations/closure-days/mutate-closure-day"

export async function createClosureDay(
  body: TMutateClosureDaySchema
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()
  try {
    const { message } = await http.post("/api/management/closure-days", body, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })

    revalidatePath("/management/closure-days")

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
