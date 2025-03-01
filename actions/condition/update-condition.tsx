"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TMutateConditionSchema } from "@/lib/validations/condition/mutate-condition"

export async function updateCondition(
  conditionId: number,
  body: TMutateConditionSchema
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()
  try {
    const { message } = await http.put(
      `/api/management/conditions/${conditionId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidatePath("/management/conditions")

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
