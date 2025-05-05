"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"
import { type TEditShelfSchema } from "@/lib/validations/shelves/edit-shelf"

export async function editShelf(
  shelfId: number,
  body: TEditShelfSchema
): Promise<ActionResponse<string>> {
  try {
    const { getAccessToken } = auth()
    const { message } = await http.put(
      `/api/management/location/shelves/${shelfId}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    revalidatePath("/management/shelves")
    revalidatePath(`/management/shelves/${shelfId}`)

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
