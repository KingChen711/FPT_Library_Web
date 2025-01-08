import { http } from "@/lib/http"

import "server-only"

import { type Notification } from "@/lib/types/models"

import { auth } from "../auth"

const getNotification = async (id: number): Promise<Notification | null> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<Notification>(
      `/api/privacy/notifications/${id}`,
      {
        next: {
          tags: ["management-notification"],
        },
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }
    )

    return data
  } catch {
    return null
  }
}

export default getNotification
