"use client"

import { useEffect, useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { Bell, Loader2 } from "lucide-react"
import { useInView } from "react-intersection-observer"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type NotificationType = "event" | "due date" | "announcement"

interface Notification {
  id: string
  title: string
  message: string
  createdDate: Date
  type: NotificationType
  read: boolean
}

type FetchNotificationsFunction = (page: number) => Promise<Notification[]>

const pageSize = 8

// Mock data for notifications
const mockNotifications: Notification[] = Array.from(
  { length: 52 },
  (_, i) => ({
    id: `${i + 1}`,
    title: `Notification ${i + 1}`,
    message: `This is the message for notification ${i + 1}.`,
    createdDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
    type: ["event", "due date", "announcement"][
      Math.floor(Math.random() * 3)
    ] as Notification["type"],
    read: Math.random() > 0.5,
  })
)

export const fetchNotifications: FetchNotificationsFunction = async (
  page: number
) => {
  console.log("call fetchNotifications")

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return 10 items per page
  return mockNotifications.slice((page - 1) * pageSize, page * pageSize)
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const { ref, inView } = useInView()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["notifications"],
      queryFn: ({ pageParam }) => fetchNotifications(pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.length === pageSize ? allPages.length + 1 : undefined
      },
    })

  const notifications = data?.pages.flat() ?? []

  const getTypeColor = (type: NotificationType): string => {
    switch (type) {
      case "event":
        return "bg-success"
      case "due date":
        return "bg-danger"
      case "announcement":
        return "bg-info"
      default:
        return "bg-primary"
    }
  }

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative"
          size="icon"
          aria-label={`${8} unread notifications`}
        >
          <Bell className="size-5" />
          {8 > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 flex size-5 items-center justify-center px-1"
            >
              {8}
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
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex flex-col items-start border-b p-2"
              >
                <div className="flex w-full items-start justify-between">
                  <span className="line-clamp-2 font-semibold">
                    {notification.title}
                  </span>
                  <Badge
                    className={`text-xs ${getTypeColor(notification.type)}`}
                  >
                    {notification.type}
                  </Badge>
                </div>
                <p className="mt-1 line-clamp-3 text-sm text-card-foreground">
                  {notification.message}
                </p>
                <span className="mt-1 text-xs text-muted-foreground">
                  {format(notification.createdDate, "MMM d, yyyy h:mm a")}
                </span>
                {!notification.read && (
                  <Badge variant="secondary" className="mt-1">
                    New
                  </Badge>
                )}
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
