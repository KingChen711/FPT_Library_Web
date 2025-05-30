import React from "react"
import { notFound } from "next/navigation"
import getNotification from "@/queries/notifications/get-notification"
import { format } from "date-fns"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import ParseHtml from "@/components/ui/parse-html"
import NotificationTypeBadge from "@/components/badges/notification-type-badge"

type Props = {
  params: {
    id: string
  }
}

async function NotificationDetailPage({ params: { id } }: Props) {
  const notification = await getNotification(+id)
  const locale = await getFormatLocale()
  const t = await getTranslations("NotificationsManagementPage")

  if (!notification) {
    notFound()
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-bold">{notification?.title}</h1>
        <NotificationTypeBadge type={notification.notificationType} />
      </div>
      <div className="mb-4 mt-2 flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          {t("Sender")}: {notification.createdByNavigation.email}
        </div>
        <div className="text-xs text-muted-foreground">
          {format(new Date(notification.createDate), "MMM d, yyyy h:mm a", {
            locale,
          })}
        </div>
      </div>
      <ParseHtml data={notification?.message} />
    </div>
  )
}

export default NotificationDetailPage
