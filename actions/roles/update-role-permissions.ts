"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { managementRoutes } from "@/constants"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type EFeature } from "@/lib/types/enums"

type TUpdateRolePermissions = {
  colId: number
  rowId: number
  permissionId: number
  isRoleVerticalLayout: boolean
}

export async function updateRolePermissions(
  body: TUpdateRolePermissions
): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()
  try {
    const { message } = await http.patch(
      "/api/management/roles/user-permissions",
      body,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    //*Start: revalidate path updated management feature
    const featureId: EFeature = body.isRoleVerticalLayout
      ? body.colId
      : body.rowId
    const path = managementRoutes.find((i) => i.feature === featureId)?.route
    if (path) {
      revalidatePath(path)
    }
    //*End: revalidate path updated management feature

    revalidateTag("user-permissions")
    revalidateTag("access-level")

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
