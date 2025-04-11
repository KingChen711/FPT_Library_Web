"use server"

import { auth } from "@/queries/auth"

import { handleHttpError, http } from "@/lib/http"
import { type ActionResponse } from "@/lib/types/action-response"

export async function borrowLibraryItems(body: {
  description: null
  libraryItemIds: number[]
}): Promise<ActionResponse<string>> {
  const { getAccessToken } = auth()

  try {
    const { message } = await http.post(`/api/borrows/requests`, body, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })

    return {
      isSuccess: true,
      data: message,
    }
  } catch (error) {
    return handleHttpError(error)
  }
}
