import { http } from "@/lib/http"

import "server-only"

import { type Employee, type Notification } from "@/lib/types/models"

import { auth } from "../auth"

type NotificationDetail = Notification & {
  createdByNavigation: Employee
}

const getNotification = async (
  id: number
): Promise<NotificationDetail | null> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<NotificationDetail>(
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
