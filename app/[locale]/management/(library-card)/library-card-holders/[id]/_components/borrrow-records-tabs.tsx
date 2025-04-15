/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Check, Eye, Loader2, MoreHorizontal, X } from "lucide-react"
import { useTranslations } from "next-intl"

import { type TSearchBorrowRecordsSchema } from "@/lib/validations/borrow-records/search-borrow-records"
import usePatronBorrowRecords from "@/hooks/patrons/use-patron-borrrow-recods"
import useFormatLocale from "@/hooks/utils/use-format-locale"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/ui/icons"
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
import BorrowTypeBadge from "@/components/badges/borrow-type-bade"

type Props = {
  userId: string
}

const initSearchParams: TSearchBorrowRecordsSchema = {
  pageIndex: 1,
  pageSize: "5",
  search: "",
  borrowDateRange: [null, null],
  f: [],
  o: [],
  v: [],
}

function BorrowRecordsTab({ userId }: Props) {
  const t = useTranslations("BorrowAndReturnManagementPage")
  const formatLocale = useFormatLocale()
  const [searchParams, setSearchParams] =
    useState<TSearchBorrowRecordsSchema>(initSearchParams)

  const { data } = usePatronBorrowRecords(userId, searchParams)

  const handleSort = (sortKey: any) =>
    setSearchParams((prev) => ({
      ...prev,
      sort: sortKey,
      pageIndex: 1,
    }))

  if (!data) {
    return (
      <TabsContent value="tracking-details">
        <Loader2 className="size-9 animate-ping" />
      </TabsContent>
    )
  }

  return (
    <TabsContent value="borrow-records">
      <div className="grid w-full">
        <div className="overflow-x-auto rounded-md border">
          <Table className="overflow-hidden">
            <TableHeader>
              <TableRow>
                <SortableTableHead
                  disabled
                  currentSort={searchParams.sort}
                  label={t("Borrow date")}
                  sortKey="BorrowDate"
                  position="center"
                  onSort={handleSort}
                />
                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">{t("Borrow type")}</div>
                </TableHead>
                <SortableTableHead
                  disabled
                  currentSort={searchParams.sort}
                  label={t("Total record items")}
                  sortKey="TotalRecordItem"
                  position="center"
                  onSort={handleSort}
                />
                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">
                    {t("Has fine to payment")}
                  </div>
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  {t("Process by")}
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">{t("Actions")}</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.sources.map((record) => (
                <TableRow key={record.borrowRecordId}>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {format(new Date(record.borrowDate), "dd MMM yyyy", {
                        locale: formatLocale,
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      <BorrowTypeBadge status={record.borrowType} />
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {record.totalRecordItem}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {record.hasFineToPayment ? (
                        <Check className="text-success" />
                      ) : (
                        <X className="text-danger" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    {record.processedByNavigation.email}
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
                              href={`/management/borrows/records/${record.borrowRecordId}`}
                              className="flex items-center gap-2"
                            >
                              <Eye className="size-4" />
                              {t("View details")}
                            </Link>
                          </DropdownMenuItem>
                          {record.hasFineToPayment && (
                            <DropdownMenuItem>
                              <Icons.Fine className="size-4" />
                              {t("Pay fines")}
                            </DropdownMenuItem>
                          )}
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

export default BorrowRecordsTab
