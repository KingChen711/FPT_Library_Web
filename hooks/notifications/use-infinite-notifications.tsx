"use client"

import { useAuth } from "@/contexts/auth-provider"
import { useInfiniteQuery } from "@tanstack/react-query"

import { http } from "@/lib/http"
import { type Notification } from "@/lib/types/models"

const pageSize = 8

export type ApiNotificationsResponse = {
  sources: Notification[]
  pageIndex: number
  pageSize: number
  totalPage: number
}

export const fetchNotifications = async (
  page: number,
  token: string | null
) => {
  if (!token) return []
  const { data } = await http.get<ApiNotificationsResponse>(
    `/api/management/notifications?PageIndex=${page}&PageSize=8`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return data.sources
}

function useInfiniteNotifications() {
  const { accessToken } = useAuth()

  return useInfiniteQuery({
    queryKey: ["infinite-notifications", accessToken],
    queryFn: ({ pageParam }) => fetchNotifications(pageParam, accessToken),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === pageSize ? allPages.length + 1 : undefined
    },
  })
}

export default useInfiniteNotifications
