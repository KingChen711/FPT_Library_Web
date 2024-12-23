import { http } from "@/lib/http"
import { type Notification } from "@/lib/types/models"

import "server-only"

import { auth } from "../auth"

const getNotification = async (id: number): Promise<Notification | null> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<Notification>(
      `/api/privacy/notifications/${id}`,
      {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    return data || null
  } catch {
    return null
  }
}

export default getNotification
