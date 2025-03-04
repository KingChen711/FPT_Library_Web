import { http } from "@/lib/http"

import "server-only"

import { auth } from "@/queries/auth"

const checkCanExtendCard = async (libraryCardId: string): Promise<boolean> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<boolean>(
      `/api/library-cards/${libraryCardId}/check-extension`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )
    return data || false
  } catch {
    return false
  }
}

export default checkCanExtendCard
