import { http } from "@/lib/http"

import "server-only"

import { type LibraryItem } from "@/lib/types/models"

import { auth } from "../auth"

const getLibraryItem = async (
  libraryItemId: number,
  email: string | null | undefined
): Promise<LibraryItem | null> => {
  const { getAccessToken } = auth()
  const url = `/api/library-items/${libraryItemId}?${email ? `email=${email}` : ""}`
  console.log({ url })

  try {
    const { data } = await http.get<LibraryItem>(url, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    })
    return data
  } catch {
    return null
  }
}

export default getLibraryItem
