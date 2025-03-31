"use client"

import { useCallback, useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-provider"
import { Link } from "@/i18n/routing"
import { type HubConnection } from "@microsoft/signalr"
import { useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { AnimatePresence, motion } from "framer-motion"
import { Bell, Loader2 } from "lucide-react"
import { useInView } from "react-intersection-observer"

import { connectToSignalR, disconnectSignalR } from "@/lib/signalR"
import {
  offReceiveNotification,
  onReceiveNotification,
  type SocketNotification,
} from "@/lib/signalR/receive-notification-signalR"
import { type Notification } from "@/lib/types/models"
import useInfiniteNotifications from "@/hooks/notifications/use-infinite-notifications"
import useResetUnread from "@/hooks/notifications/use-reset-unread"
import useUnreadAmount from "@/hooks/notifications/use-unread-amount"
import useFormatLocale from "@/hooks/utils/use-format-locale"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import NotificationTypeBadge from "../badges/notification-type-badge"
import ParseHtml from "./parse-html"

export function NotificationBell() {
  const { accessToken } = useAuth()
  const [connection, setConnection] = useState<HubConnection | null>(null)
  const queryClient = useQueryClient()
  const formatLocale = useFormatLocale()
  const [open, setOpen] = useState(false)
  const { ref, inView } = useInView()
  const [newNotifications, setNewNotifications] = useState<Notification[]>([])
  const [isShaking, setIsShaking] = useState(false)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteNotifications({})

  const notifications = data?.pages.flat() ?? []

  const { data: unreadAmountData } = useUnreadAmount()
  const [unreadAmount, setUnreadAmount] = useState(0)

  const { mutate: resetUnread } = useResetUnread()

  const handleShake = useCallback(() => {
    if (!isShaking) {
      setIsShaking(true)
      setTimeout(() => setIsShaking(false), 500) // Reset after animation
    }
  }, [isShaking])

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  useEffect(() => {
    if (open) {
      setUnreadAmount(0)
      resetUnread(undefined, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["unread-notifications-amount"],
          })
        },
      })
    }
  }, [open, resetUnread, queryClient])

  useEffect(() => {
    setUnreadAmount(unreadAmountData || 0)
  }, [unreadAmountData])

  useEffect(() => {
    if (!accessToken) return

    const connection = connectToSignalR("notificationHub", accessToken)
    setConnection(connection)

    return () => {
      disconnectSignalR(connection)
    }
  }, [accessToken])

  useEffect(() => {
    if (!connection) return

    const callback = (notification: SocketNotification) => {
      handleShake()
      if (!open) {
        setUnreadAmount((prev) => prev + 1)
      }
      setNewNotifications((prev) => [
        {
          createDate: new Date(notification.timestamp),
          createdBy: "",
          isPublic: false,
          message: notification.message,
          notificationId: notification.notificationId,
          notificationRecipients: [],
          title: notification.title,
          notificationType: notification.notificationType,
        },
        ...prev,
      ])
    }

    onReceiveNotification(connection, callback)

    return () => {
      offReceiveNotification(connection, callback)
    }
  }, [connection, open, handleShake])

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative"
          size="icon"
          aria-label={`${unreadAmount} unread notifications`}
        >
          <AnimatePresence>
            <motion.div
              key="bell"
              animate={isShaking ? "shake" : "idle"}
              variants={{
                idle: { rotate: 0 },
                shake: {
                  rotate: [0, 15, -15, 0],
                  transition: {
                    duration: 0.5,
                    times: [0, 0.2, 0.8, 1],
                  },
                },
              }}
              onClick={handleShake}
              className="cursor-pointer"
            >
              <Bell className="size-5" />
            </motion.div>
          </AnimatePresence>
          {unreadAmount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 flex size-5 items-center justify-center px-1"
            >
              {unreadAmount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="max-h-[80vh] w-80 overflow-y-auto"
      >
        {status === "pending" ? (
          <DropdownMenuItem>
            <Loader2 className="mr-2" />
            Loading notifications...
          </DropdownMenuItem>
        ) : status === "error" ? (
          <DropdownMenuItem>Error loading notifications</DropdownMenuItem>
        ) : notifications.length === 0 ? (
          <DropdownMenuItem>No notifications</DropdownMenuItem>
        ) : (
          <>
            {[...newNotifications, ...notifications].map((notification) => (
              <DropdownMenuItem
                key={notification.notificationId}
                className="flex flex-col items-start border-b p-2"
                asChild
              >
                <Link
                  href={`/me/account/notifications/${notification.notificationId}`}
                >
                  <div className="flex w-full items-start justify-between">
                    <span className="line-clamp-2 font-semibold">
                      {notification.title}
                    </span>
                    <NotificationTypeBadge
                      type={notification.notificationType}
                    />
                  </div>
                  <p className="line-clamp-3 text-sm leading-none text-card-foreground">
                    <ParseHtml
                      className="!text-sm"
                      data={notification.message}
                    />
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {format(
                      new Date(notification.createDate),
                      "MMM d, yyyy h:mm a",
                      {
                        locale: formatLocale,
                      }
                    )}
                  </span>
                </Link>
              </DropdownMenuItem>
            ))}
            {hasNextPage ? (
              <DropdownMenuItem ref={ref} className="text-center">
                {isFetchingNextPage ? (
                  <Loader2 className="mx-auto" />
                ) : (
                  "Load more"
                )}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem ref={ref} className="text-center">
                That is all your notifications
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
