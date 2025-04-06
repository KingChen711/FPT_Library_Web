import { http } from "@/lib/http"
import { type LibraryItemLanguage } from "@/lib/types/models"

import "server-only"

const getAvailableLanguages = async (): Promise<LibraryItemLanguage[]> => {
  try {
    const { data } = await http.get<LibraryItemLanguage[]>(
      `/api/library-items/available-languages`
    )
    return data
  } catch {
    return []
  }
}

export default getAvailableLanguages
