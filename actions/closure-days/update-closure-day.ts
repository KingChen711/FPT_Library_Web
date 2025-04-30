"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TMutateClosureDaySchema } from "@/lib/validations/closure-days/mutate-closure-day"

export async function updateClosureDay(
  body: TMutateClosureDaySchema & { closureDayId: number }
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()
  try {
    const { message } = await http.put(
      `/api/management/closure-days/${body.closureDayId}`,
      { ...body, closureDayId: undefined },
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidatePath("/management/closure-days")

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
