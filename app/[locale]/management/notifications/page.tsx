import React from "react"
import { auth } from "@/queries/auth"
import getNotifications from "@/queries/notifications/get-notifications"
import { format } from "date-fns"

import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { searchNotificationsSchema } from "@/lib/validations/notifications/search-notifications"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import NotificationTypeBadge from "@/components/ui/notification-type-badge"
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

import CreateNotificationDialog from "./_components/create-notification-dialog"
import FiltersNotificationsDialog from "./_components/filters-notifications-dialog"

type Props = {
  searchParams: {
    search?: string
    pageIndex?: string
    pageSize?: string
    sort?: string
  }
}

async function NotificationPage({ searchParams }: Props) {
  const { search, pageIndex, sort, pageSize } =
    searchNotificationsSchema.parse(searchParams)

  await auth().protect(EFeature.BORROW_MANAGEMENT)

  const t = await getTranslations("NotificationsManagementPage")

  const {
    sources: notifications,
    totalActualItem,
    totalPage,
  } = await getNotifications({ search, pageIndex, sort, pageSize })

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
        <div className="flex flex-wrap items-center gap-x-4">
          <CreateNotificationDialog />
        </div>
      </div>

      <div className="mt-4 grid w-full">
        <div className="overflow-x-auto rounded-md border">
          <Table className="overflow-hidden">
            <TableHeader className="">
              <TableRow className="">
                <SortableTableHead
                  currentSort={sort}
                  label="Id"
                  sortKey="NotificationId"
                />
                <SortableTableHead
                  currentSort={sort}
                  label={t("Title")}
                  sortKey="Title"
                />
                <TableHead className="text-nowrap font-bold">
                  {t("Message")}
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  {t("Visibility")}
                </TableHead>
                <SortableTableHead
                  currentSort={sort}
                  label={t("Created date")}
                  sortKey="createDate"
                />
                <TableHead className="text-nowrap font-bold">
                  {t("Created by")}
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  {t("Type")}
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  {t("Recipients")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.notificationId}>
                  <TableCell className="font-extrabold">
                    {notification.notificationId}
                  </TableCell>
                  <TableCell className="text-nowrap font-extrabold">
                    {notification.title}
                  </TableCell>
                  <TableCell className="line-clamp-1 text-nowrap font-extrabold">
                    <Dialog>
                      <DialogTrigger>{t("View content")}</DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t("Message content")}</DialogTitle>
                          <DialogDescription>
                            <ParseHtml data={notification.message} />
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell>isPublic</TableCell>
                  <TableCell>
                    {format(new Date(notification.createDate), "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell>{notification.createdBy}</TableCell>
                  <TableCell>
                    <NotificationTypeBadge
                      type={notification.notificationType}
                    />
                  </TableCell>
                  <TableCell className="line-clamp-1 text-nowrap font-extrabold">
                    <Dialog>
                      <DialogTrigger>{t("View recipients")}</DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t("Recipients")}</DialogTitle>
                          <DialogDescription>
                            <div className="flex items-center gap-4">
                              {notification.notificationRecipients.map((r) => (
                                <div
                                  key={r}
                                  className="rounded-md bg-muted px-2 py-1 text-muted-foreground"
                                >
                                  {r}
                                </div>
                              ))}
                            </div>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
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
    </div>
  )
}

export default NotificationPage
