import React from "react"
import { notFound } from "next/navigation"
import { getTypeColor } from "@/constants"
import getNotification from "@/queries/notifications/get-notification"
import { format } from "date-fns"

import { Badge } from "@/components/ui/badge"

type Props = {
  params: {
    id: string
  }
}

async function NotificationDetailPage({ params: { id } }: Props) {
  const notification = await getNotification(+id)

  if (!notification) {
    notFound()
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-bold">{notification?.title}</h1>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Badge
          className={`text-xs ${getTypeColor(notification.notificationType)}`}
        >
          {notification?.notificationType}
        </Badge>
        <div className="mt-4 text-xs text-muted-foreground">
          {format(new Date(notification.createDate), "MMM d, yyyy h:mm a")}
        </div>
      </div>
      <p className="mt-4">{notification?.message}</p>
    </div>
  )
}

export default NotificationDetailPage
