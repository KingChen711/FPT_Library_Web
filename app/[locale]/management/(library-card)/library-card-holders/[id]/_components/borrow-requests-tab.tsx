"use client"

import React, { useState } from "react"
import { format } from "date-fns"
import { Check, X } from "lucide-react"
import { useTranslations } from "next-intl"

import usePatronBorrowRequests from "@/hooks/patrons/use-patron-borrow-requests"
import useFormatLocale from "@/hooks/utils/use-format-locale"
import BorrowRequestStatusBadge from "@/components/ui/borrow-request-status-badge"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"

type Props = {
  userId: string
}

function BorrowRequestsTab({ userId }: Props) {
  const t = useTranslations("LibraryCardManagementPage")
  const formatLocale = useFormatLocale()

  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState<"5" | "10" | "30" | "50" | "100">(
    "5"
  )

  const { data, isLoading } = usePatronBorrowRequests(userId, {
    pageIndex,
    pageSize,
  })

  const handlePaginate = (selectedPage: number) => {
    setPageIndex(selectedPage)
  }

  const handleChangePageSize = (size: "5" | "10" | "30" | "50" | "100") => {
    setPageSize(size)
  }

  return (
    <TabsContent value="borrow-requests">
      <div className="grid w-full">
        <div className="overflow-x-auto rounded-md border">
          <Table className="overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead className="text-nowrap font-bold">
                  {t("Request date")}
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  {t("Expiration date")}
                </TableHead>
                <TableHead>
                  <div className="flex justify-center text-nowrap font-bold">
                    {t("Status")}
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex justify-center text-nowrap font-bold">
                    {t("Total request item")}
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex justify-center text-nowrap font-bold">
                    {t("Reminder sent")}
                  </div>
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">{t("Description")}</div>
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  {t("Cancelled at")}
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">
                    {t("Cancellation reason")}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isLoading &&
                data?.sources.map((request) => (
                  <TableRow key={request.borrowRequestId}>
                    <TableCell className="text-nowrap">
                      {request.requestDate
                        ? format(new Date(request.requestDate), "dd MMM yyyy", {
                            locale: formatLocale,
                          })
                        : "-"}
                    </TableCell>
                    <TableCell className="text-nowrap">
                      {request.expirationDate
                        ? format(
                            new Date(request.expirationDate),
                            "dd MMM yyyy",
                            {
                              locale: formatLocale,
                            }
                          )
                        : "-"}
                    </TableCell>
                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        <BorrowRequestStatusBadge status={request.status} />
                      </div>
                    </TableCell>
                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {request.totalRequestItem ?? "-"}
                      </div>
                    </TableCell>
                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {request.isReminderSent ? (
                          <Check className="size-6 text-success" />
                        ) : (
                          <X className="size-6 text-danger" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {request.description ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="secondary">
                                {t("View content")}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[80vh] w-full max-w-2xl overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>{t("Description")}</DialogTitle>
                                <DialogDescription>
                                  <ParseHtml data={request.description} />
                                </DialogDescription>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          "-"
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-nowrap">
                      {request.cancelledAt
                        ? format(new Date(request.cancelledAt), "dd MMM yyyy", {
                            locale: formatLocale,
                          })
                        : "-"}
                    </TableCell>
                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {request.cancellationReason ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="secondary">
                                {t("Cancellation reason")}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[80vh] w-full max-w-2xl overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>
                                  {t("Cancellation reason")}
                                </DialogTitle>
                                <DialogDescription>
                                  <ParseHtml
                                    data={request.cancellationReason}
                                  />
                                </DialogDescription>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          "-"
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {data && (
          <Paginator
            pageSize={+pageSize}
            pageIndex={pageIndex}
            totalPage={data.totalPage}
            totalActualItem={data.totalActualItem}
            className="mt-6"
            onPaginate={handlePaginate}
            onChangePageSize={handleChangePageSize}
          />
        )}
      </div>
    </TabsContent>
  )
}

export default BorrowRequestsTab
