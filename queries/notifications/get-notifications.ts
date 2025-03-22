import { http } from "@/lib/http"

import "server-only"

import { format } from "date-fns"

import { type Employee, type Notification } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchNotificationsSchema } from "@/lib/validations/notifications/search-notifications"

import { auth } from "../auth"

export type Notifications = (Notification & { createdByNavigation: Employee })[]

const getNotifications = async (
  searchParams: TSearchNotificationsSchema
): Promise<Pagination<Notifications>> => {
  const { getAccessToken } = auth()
  try {
    const formatDate = (d: Date) => format(d, "yyyy-MM-dd")
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
          createDateRange:
            JSON.stringify(searchParams.createDateRange) ===
            JSON.stringify([null, null])
              ? null
              : searchParams.createDateRange.map((d) =>
                  d === null ? "null" : formatDate(new Date(d))
                ),
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
