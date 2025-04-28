import React from "react"
import { Link } from "@/i18n/routing"
import { auth } from "@/queries/auth"
import getPrivacyNotifications from "@/queries/notifications/get-privacy-notifications"
import { format } from "date-fns"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import { searchNotificationsPrivacySchema } from "@/lib/validations/notifications/search-privacy-notifications"
import Paginator from "@/components/ui/paginator"
import ParseHtml from "@/components/ui/parse-html"
import SearchForm from "@/components/ui/search-form"
import NotificationTypeBadge from "@/components/badges/notification-type-badge"

import FiltersNotificationsDialog from "./_components/filters-notifications-dialog"

type Props = {
  searchParams: {
    search?: string
    pageIndex?: string
    pageSize?: string
    sort?: string
    type?: string
    visibility?: string
    createDateRange?: string
  }
}

const NotificationManagementPage = async ({ searchParams }: Props) => {
  await auth().protect()
  const t = await getTranslations("NotificationsManagementPage")
  const { search, pageIndex, sort, pageSize, ...rest } =
    searchNotificationsPrivacySchema.parse(searchParams)

  const {
    sources: notifications,
    totalActualItem,
    totalPage,
  } = await getPrivacyNotifications({
    search,
    pageIndex,
    sort,
    pageSize,
    ...rest,
  })

  const formatLocale = await getFormatLocale()

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Notifications")}</h3>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-row items-center">
            <SearchForm
              className="h-full rounded-r-none border-r-0"
              search={search}
            />
            <FiltersNotificationsDialog />
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {notifications?.map((notification) => (
          <Link
            key={notification.notificationId}
            href={`/me/account/notifications/${notification.notificationId}`}
            className="flex flex-col items-start rounded-md border p-4 hover:bg-muted"
          >
            <div className="flex w-full items-start justify-between">
              <span className="line-clamp-2 font-semibold">
                {notification.title}
              </span>
              <NotificationTypeBadge type={notification.notificationType} />
            </div>
            <div className="mt-1 line-clamp-3 text-sm text-card-foreground">
              <ParseHtml data={notification.message} />
            </div>
            <div className="mt-2 flex w-full flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
              {notification?.createdByNavigation?.email && (
                <div>
                  {t("Sender")}: {notification.createdByNavigation.email}
                </div>
              )}
              <div className="">
                {format(
                  new Date(notification.createDate),
                  "MMM d, yyyy h:mm a",
                  {
                    locale: formatLocale,
                  }
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Paginator
        pageSize={+pageSize}
        pageIndex={pageIndex}
        totalPage={totalPage}
        totalActualItem={totalActualItem}
        className="mt-6"
      />
    </div>
  )
}

export default NotificationManagementPage
