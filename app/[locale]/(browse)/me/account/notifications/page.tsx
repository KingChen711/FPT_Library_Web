"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-provider"
import { useRouter } from "@/i18n/routing"
import { format } from "date-fns"
import { Loader2, Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { useInView } from "react-intersection-observer"
import { useDebounce } from "use-debounce"

import useInfiniteNotifications from "@/hooks/notifications/use-infinite-notifications"
import useFormatLocale from "@/hooks/utils/use-format-locale"
import { Input } from "@/components/ui/input"
import NotificationTypeBadge from "@/components/badges/notification-type-badge"

const NotificationManagementPage = () => {
  const t = useTranslations("NotificationsPage")
  const router = useRouter()
  const formatLocale = useFormatLocale()

  const { isLoadingAuth, user } = useAuth()
  const { ref, inView } = useInView()
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteNotifications({ pageSize: 30, search: debouncedSearchTerm })

  const notifications = data?.pages.flat() ?? []

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isLoadingAuth)
    return (
      <div className="flex justify-center">
        <Loader2 className="size-12 animate-spin" />
      </div>
    )

  if (!user) {
    router.push("/login")
    return
  }

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center rounded-md border py-1 pl-3">
        <Search className="size-6" />
        <Input
          className="border-none outline-none focus-visible:ring-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t("Search")}
        />
      </div>
      {status === "pending" ? (
        <div>
          <Loader2 className="mr-2" />
          Loading notifications...
        </div>
      ) : status === "error" ? (
        <div>Error loading notifications </div>
      ) : notifications.length === 0 ? (
        <div>No notifications</div>
      ) : (
        <>
          {[...notifications].map((notification) => (
            <Link
              key={notification.notificationId}
              href={`/me/account/notifications/${notification.notificationId}`}
              className="flex flex-col items-start border-b p-2 hover:opacity-70"
            >
              <div className="flex w-full items-start justify-between">
                <span className="line-clamp-2 font-semibold">
                  {notification.title}
                </span>
                <NotificationTypeBadge type={notification.notificationType} />
              </div>
              <p className="mt-1 line-clamp-3 text-sm text-card-foreground">
                {notification.message}
              </p>
              <span className="mt-1 text-xs text-muted-foreground">
                {format(
                  new Date(notification.createDate),
                  "MMM d, yyyy h:mm a",
                  { locale: formatLocale }
                )}
              </span>
            </Link>
          ))}
          {hasNextPage ? (
            <div ref={ref} className="text-center">
              {isFetchingNextPage ? (
                <Loader2 className="mx-auto" />
              ) : (
                "Load more"
              )}
            </div>
          ) : (
            <div ref={ref} className="mt-4 text-center">
              That is all your notifications
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default NotificationManagementPage
