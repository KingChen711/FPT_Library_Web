import { http } from "@/lib/http"

import "server-only"

import { type LibraryItem } from "@/lib/types/models"

const getLibraryItem = async (
  libraryItemId: number
): Promise<LibraryItem | null> => {
  try {
    const { data } = await http.get<LibraryItem>(
      `/api/library-items/${libraryItemId}`
    )
    return data
  } catch {
    return null
  }
}

export default getLibraryItem
