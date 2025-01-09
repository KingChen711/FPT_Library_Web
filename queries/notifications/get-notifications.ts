import { http } from "@/lib/http"

import "server-only"

import { type Notification } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchNotificationsSchema } from "@/lib/validations/notifications/search-notifications"

import { auth } from "../auth"

export type Notifications = Notification[]

const getNotifications = async (
  searchParams: TSearchNotificationsSchema
): Promise<Pagination<Notifications>> => {
  const { getAccessToken } = auth()
  try {
    const { data } = await http.get<Pagination<Notifications>>(
      `/api/management/notifications`,
      {
        next: {
          tags: ["management-notifications"],
        },
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        searchParams: {
          ...searchParams,
          createDateRange: searchParams.createDateRange.map((d) =>
            d ? d.toString() : d
          ),
          notificationType:
            searchParams.notificationType === "All"
              ? null
              : searchParams.notificationType,
          visibility:
            searchParams.visibility === "All" ? null : searchParams.visibility,
        },
      }
    )

    return data
  } catch {
    return {
      sources: [],
      pageIndex: searchParams.pageIndex,
      pageSize: +searchParams.pageSize,
      totalActualItem: 0,
      totalPage: 0,
    }
  }
}

export default getNotifications
