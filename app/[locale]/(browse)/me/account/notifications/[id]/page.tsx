import React from "react"
import { notFound } from "next/navigation"
import getNotification from "@/queries/notifications/get-notification"
import { format } from "date-fns"
import enUS from "date-fns/locale/en-US"
import vi from "date-fns/locale/vi"
import { getLocale } from "next-intl/server"

import { getFormatLocale } from "@/lib/get-format-locale"
import NotificationTypeBadge from "@/components/ui/notification-type-badge"

type Props = {
  params: {
    id: string
  }
}

async function NotificationDetailPage({ params: { id } }: Props) {
  const notification = await getNotification(+id)
  const locale = await getFormatLocale()

  if (!notification) {
    notFound()
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-xl font-bold">{notification?.title}</h1>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <NotificationTypeBadge type={notification.notificationType} />
        <div className="mt-4 text-xs text-muted-foreground">
          {format(new Date(notification.createDate), "MMM d, yyyy h:mm a", {
            locale,
          })}
        </div>
      </div>
      <p className="mt-4">{notification?.message}</p>
    </div>
  )
}

export default NotificationDetailPage
