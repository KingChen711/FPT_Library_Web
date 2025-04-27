/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState } from "react"
import { Link } from "@/i18n/routing"
import { format } from "date-fns"
import { Eye, Loader2, MoreHorizontal } from "lucide-react"
import { useTranslations } from "next-intl"

import { type TSearchBorrowRequestsSchema } from "@/lib/validations/borrow-requests/search-borrow-requests"
import usePatronBorrowRequests from "@/hooks/patrons/use-patron-borrow-requests"
import useFormatLocale from "@/hooks/utils/use-format-locale"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Paginator from "@/components/ui/paginator"
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
import BorrowRequestStatusBadge from "@/components/badges/borrow-request-status-badge"

type Props = {
  userId: string
}

const initSearchParams: TSearchBorrowRequestsSchema = {
  pageIndex: 1,
  pageSize: "5",
  search: "",
  cancelledAtRange: [null, null],
  expirationDateRange: [null, null],
  requestDateRange: [null, null],
  f: [],
  o: [],
  v: [],
}

function BorrowRequestsTab({ userId }: Props) {
  const t = useTranslations("BorrowAndReturnManagementPage")
  const formatLocale = useFormatLocale()
  const [searchParams, setSearchParams] =
    useState<TSearchBorrowRequestsSchema>(initSearchParams)

  const { data } = usePatronBorrowRequests(userId, searchParams)

  const handleSort = (sortKey: any) =>
    setSearchParams((prev) => ({
      ...prev,
      sort: sortKey,
      pageIndex: 1,
    }))

  if (!data) {
    return (
      <TabsContent value="tracking-details">
        <Loader2 className="size-9 animate-spin" />
      </TabsContent>
    )
  }

  return (
    <TabsContent value="borrow-requests">
      <div className="grid w-full">
        <div className="overflow-x-auto rounded-md border">
          <Table className="overflow-hidden">
            <TableHeader>
              <TableRow>
                <SortableTableHead
                  disabled
                  currentSort={searchParams.sort}
                  label={t("Request date")}
                  sortKey="RequestDate"
                  position="center"
                  onSort={handleSort}
                />
                <SortableTableHead
                  disabled
                  currentSort={searchParams.sort}
                  label={t("Expiration date")}
                  sortKey="ExpirationDate"
                  position="center"
                  onSort={handleSort}
                />
                <SortableTableHead
                  disabled
                  currentSort={searchParams.sort}
                  label={t("Total request items")}
                  sortKey="TotalRequestItem"
                  position="center"
                  onSort={handleSort}
                />
                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">{t("Status")}</div>
                </TableHead>

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">{t("Actions")}</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.sources?.map((request) => (
                <TableRow key={request.borrowRequestId}>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {format(new Date(request.requestDate), "dd MMM yyyy", {
                        locale: formatLocale,
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {request.expirationDate
                        ? format(
                            new Date(request.expirationDate),
                            "dd MMM yyyy",
                            {
                              locale: formatLocale,
                            }
                          )
                        : "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {request.totalRequestItem}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      <BorrowRequestStatusBadge status={request.status} />
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Link
                              target="_blank"
                              href={`/management/borrows/requests/${request.borrowRequestId}`}
                              className="flex items-center gap-2"
                            >
                              <Eye className="size-4" />
                              {t("View details")}
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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

export default BorrowRequestsTab
