"use server"

import { revalidateTag } from "next/cache"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

type TUpdateRolePermissions = {
  colId: number
  rowId: number
  permissionId: number
  isRoleVerticalLayout: boolean
}

export async function updateRolePermissions(
  body: TUpdateRolePermissions
): Promise<ActionResponse<string>> {
  try {
    const { message } = await http.patch("/api/roles/user-permissions", body)

    revalidateTag("user-permissions")

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
