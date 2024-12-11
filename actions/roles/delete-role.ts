"use server"

import { revalidatePath } from "next/cache"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function deleteRole(
  roleId: number
): Promise<ActionResponse<string>> {
  try {
    const { message } = await http.delete(`/api/roles?roleId=${roleId}`)

    revalidatePath("/management/roles")

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
