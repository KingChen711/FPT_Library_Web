import { http } from "@/lib/http"

import "server-only"

import { format } from "date-fns"

import { type Employee, type Notification } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchNotificationsPrivacySchema } from "@/lib/validations/notifications/search-privacy-notifications"

import { auth } from "../auth"

export type PrivacyNotifications = (Notification & {
  createdByNavigation: Employee
})[]

const getPrivacyNotifications = async (
  searchParams: TSearchNotificationsPrivacySchema
): Promise<Pagination<PrivacyNotifications>> => {
  const { getAccessToken } = auth()
  try {
    const formatDate = (d: Date) => format(d, "yyyy-MM-dd")
    const { data } = await http.get<Pagination<PrivacyNotifications>>(
      `/api/privacy/notifications`,
      {
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

export default getPrivacyNotifications
