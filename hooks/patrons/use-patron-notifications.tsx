/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useAuth } from "@/contexts/auth-provider"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

import { http } from "@/lib/http"
import { type Employee, type Notification } from "@/lib/types/models"
import { type Pagination } from "@/lib/types/pagination"
import { type TSearchNotificationsSchema } from "@/lib/validations/notifications/search-notifications"

function usePatronNotifications(
  userId: string,
  searchParams: TSearchNotificationsSchema
) {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: [
      "management",
      "borrow-notifications",
      accessToken,
      userId,
      searchParams,
    ],
    queryFn: async () => {
      const formatDate = (d: Date) => format(d, "yyyy-MM-dd")
      try {
        if (!accessToken) throw new Error()

        const { data } = await http.get<
          Pagination<(Notification & { createdByNavigation: Employee })[]>
        >(`/api/management/library-card-holders/${userId}/notifications`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          searchParams: {
            ...searchParams,
            createDateRange:
              JSON.stringify(searchParams.createDateRange) ===
              JSON.stringify([null, null])
                ? null
                : searchParams.createDateRange.map((d) =>
                    d === null ? "" : formatDate(new Date(d))
                  ),
          },
        })

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
    },
    placeholderData: keepPreviousData,
  })
}

export default usePatronNotifications
