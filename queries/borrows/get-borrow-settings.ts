import { http } from "@/lib/http"

import "server-only"

import { type BorrowSettings } from "@/lib/types/models"

const getBorrowSettings = async (): Promise<BorrowSettings | null> => {
  try {
    const { data } = await http.get<BorrowSettings>(
      `/api/system-configurations/borrow-settings`
    )

    return data || null
  } catch {
    return null
  }
}

export default getBorrowSettings
