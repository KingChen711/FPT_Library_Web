import React from "react"
import { auth } from "@/queries/auth"
import getNotifications from "@/queries/notifications/get-notifications"
import { format } from "date-fns"

import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { searchNotificationsSchema } from "@/lib/validations/notifications/search-notifications"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import NoResult from "@/components/ui/no-result"
import Paginator from "@/components/ui/paginator"
import ParseHtml from "@/components/ui/parse-html"
import SearchForm from "@/components/ui/search-form"
import SortableTableHead from "@/components/ui/sortable-table-head"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import NotificationTypeBadge from "@/components/badges/notification-type-badge"
import VisibilityBadge from "@/components/badges/visibility-badge"

import CreateNotificationDialog from "./_components/create-notification-dialog"
import FiltersNotificationsDialog from "./_components/filters-notifications-dialog"
import RecipientsDialog from "./_components/recipients-dialog"

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

async function NotificationPage({ searchParams }: Props) {
  await auth().protect(EFeature.BORROW_MANAGEMENT)
  const t = await getTranslations("NotificationsManagementPage")

  const { search, pageIndex, sort, pageSize, ...rest } =
    searchNotificationsSchema.parse(searchParams)

  const {
    sources: notifications,
    totalActualItem,
    totalPage,
  } = await getNotifications({
    search,
    pageIndex,
    sort,
    pageSize,
    ...rest,
  })

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Notifications")}</h3>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-row items-center">
            <SearchForm
              className="h-10 rounded-r-none border-r-0"
              search={search}
            />
            <FiltersNotificationsDialog />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-4">
          <CreateNotificationDialog />
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="flex justify-center p-4">
          <NoResult
            title={t("Notifications Not Found")}
            description={t(
              "No notifications matching your request were found Please check your information or try searching with different criteria"
            )}
          />
        </div>
      ) : (
        <div className="mt-4 grid w-full">
          <div className="overflow-x-auto rounded-md border">
            <Table className="overflow-hidden">
              <TableHeader>
                <TableRow>
                  <SortableTableHead
                    currentSort={sort}
                    label={t("Title")}
                    sortKey="Title"
                  />
                  <TableHead className="text-nowrap font-bold">
                    {t("Message")}
                  </TableHead>
                  <TableHead className="text-nowrap font-bold">
                    {t("Recipients")}
                  </TableHead>
                  <TableHead>
                    <div className="flex justify-center text-nowrap font-bold">
                      {t("Visibility")}
                    </div>
                  </TableHead>
                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center text-nowrap font-bold">
                      {t("Type")}
                    </div>
                  </TableHead>
                  <SortableTableHead
                    currentSort={sort}
                    label={t("Created date")}
                    sortKey="createDate"
                  />
                  <TableHead className="text-nowrap font-bold">
                    {t("Created by")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((notification) => (
                  <TableRow key={notification.notificationId}>
                    <TableCell className="text-nowrap font-bold">
                      {notification.title}
                    </TableCell>
                    <TableCell className="text-nowrap">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="secondary">
                            {t("View content")}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[80vh] w-full max-w-2xl overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{t("Message content")}</DialogTitle>
                            <DialogDescription>
                              <ParseHtml data={notification.message} />
                            </DialogDescription>
                          </DialogHeader>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell className="text-nowrap">
                      {notification.isPublic ? (
                        t("All")
                      ) : (
                        <RecipientsDialog
                          notificationId={notification.notificationId}
                        />
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-center">
                        <VisibilityBadge isPublic={notification.isPublic} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <NotificationTypeBadge
                          type={notification.notificationType}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(notification.createDate), "dd-MM-yyyy")}
                    </TableCell>
                    <TableCell>
                      {notification.createdByNavigation.email}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Paginator
            pageSize={+pageSize}
            pageIndex={pageIndex}
            totalPage={totalPage}
            totalActualItem={totalActualItem}
            className="mt-6"
          />
        </div>
      )}
    </div>
  )
}

export default NotificationPage
