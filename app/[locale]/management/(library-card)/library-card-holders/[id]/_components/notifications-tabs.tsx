/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState } from "react"
import { format } from "date-fns"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { type TSearchNotificationsSchema } from "@/lib/validations/notifications/search-notifications"
import usePatronNotifications from "@/hooks/patrons/use-patron-notifications"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Paginator from "@/components/ui/paginator"
import ParseHtml from "@/components/ui/parse-html"
import SortableTableHead from "@/components/ui/sortable-table-head"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"
import NotificationTypeBadge from "@/components/badges/notification-type-badge"
import VisibilityBadge from "@/components/badges/visibility-badge"
import RecipientsDialog from "@/app/[locale]/management/notifications/_components/recipients-dialog"

type Props = {
  userId: string
}

const initSearchParams: TSearchNotificationsSchema = {
  pageIndex: 1,
  pageSize: "5",
  search: "",
  createDateRange: [null, null],
}

function NotificationsTab({ userId }: Props) {
  const t = useTranslations("NotificationsManagementPage")

  const [searchParams, setSearchParams] =
    useState<TSearchNotificationsSchema>(initSearchParams)

  const { data } = usePatronNotifications(userId, searchParams)

  if (!data) {
    return (
      <TabsContent value="tracking-details">
        <Loader2 className="size-9 animate-ping" />
      </TabsContent>
    )
  }

  return (
    <TabsContent value="notifications">
      <div className="grid w-full">
        <div className="overflow-x-auto rounded-md border">
          <Table className="overflow-hidden">
            <TableHeader>
              <TableRow>
                <SortableTableHead
                  disabled
                  currentSort={searchParams.sort}
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
                  disabled
                  currentSort={searchParams.sort}
                  label={t("Created date")}
                  sortKey="createDate"
                />
                <TableHead className="text-nowrap font-bold">
                  {t("Created by")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.sources?.map((notification) => (
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

        {data && data.sources.length > 0 && (
          <Paginator
            pageSize={+data.pageSize}
            pageIndex={data.pageIndex}
            totalPage={data.totalPage}
            totalActualItem={data.totalActualItem}
            className="mt-6"
            onPaginate={(page) =>
              setSearchParams((prev) => ({
                ...prev,
                pageIndex: page,
              }))
            }
            onChangePageSize={(size) =>
              setSearchParams((prev) => ({
                ...prev,
                pageSize: size,
              }))
            }
          />
        )}
      </div>
    </TabsContent>
  )
}

export default NotificationsTab
