/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Eye, Loader2, MoreHorizontal } from "lucide-react"
import { useTranslations } from "next-intl"

import { formatFileSize, formatPrice } from "@/lib/utils"
import { type TSearchBorrowDigitalsManagementSchema } from "@/lib/validations/borrow-digitals-management/search-borrow-digitals-management"
import usePatronBorrowDigitals from "@/hooks/patrons/use-patron-borrow-digitals"
import useFormatLocale from "@/hooks/utils/use-format-locale"
import BorrowDigitalStatusBadge from "@/components/ui/borrow-digital-status-badge"
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
import ResourceBookTypeBadge from "@/components/badges/book-resource-type-badge"

type Props = {
  userId: string
}

const initSearchParams: TSearchBorrowDigitalsManagementSchema = {
  pageIndex: 1,
  pageSize: "5",
  search: "",
  expiryDateRange: [null, null],
  registerDateRange: [null, null],
  f: [],
  o: [],
  v: [],
}

function BorrowDigitalsTab({ userId }: Props) {
  const t = useTranslations("BorrowAndReturnManagementPage")
  const formatLocale = useFormatLocale()
  const [searchParams, setSearchParams] =
    useState<TSearchBorrowDigitalsManagementSchema>(initSearchParams)

  const { data } = usePatronBorrowDigitals(userId, searchParams)

  if (!data) {
    return (
      <TabsContent value="tracking-details">
        <Loader2 className="size-9 animate-ping" />
      </TabsContent>
    )
  }

  return (
    <TabsContent value="borrow-digitals">
      <div className="grid w-full">
        <div className="overflow-x-auto rounded-md border">
          <Table className="overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead className="text-nowrap font-bold">
                  {t("Resource item")}
                </TableHead>

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">
                    {t("Resource type")}
                  </div>
                </TableHead>

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">{t("Size")}</div>
                </TableHead>

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">
                    {t("Default borrow duration days")}
                  </div>
                </TableHead>

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">{t("Borrow price")}</div>
                </TableHead>

                <SortableTableHead
                  disabled
                  currentSort={searchParams.sort}
                  label={t("Borrow date")}
                  sortKey="RegisterDate"
                  position="center"
                />

                <SortableTableHead
                  disabled
                  currentSort={searchParams.sort}
                  label={t("Expiry date")}
                  sortKey="ExpiryDate"
                  position="center"
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
              {data?.sources?.map((digital) => (
                <TableRow key={digital.digitalBorrowId}>
                  <TableCell className="text-nowrap">
                    <div className="flex">
                      {digital.libraryResource.resourceTitle}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      <ResourceBookTypeBadge
                        status={digital.libraryResource.resourceType}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {formatFileSize(digital.libraryResource.resourceSize)}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {digital.libraryResource.defaultBorrowDurationDays ?? "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {digital.libraryResource.borrowPrice
                        ? formatPrice(digital.libraryResource.borrowPrice)
                        : "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {format(
                        new Date(digital.registerDate),
                        "HH:mm dd MMM yyyy",
                        {
                          locale: formatLocale,
                        }
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {format(
                        new Date(digital.expiryDate),
                        "HH:mm dd MMM yyyy",
                        {
                          locale: formatLocale,
                        }
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      <BorrowDigitalStatusBadge status={digital.status} />
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
                              href={`/management/borrows/digitals/${digital.digitalBorrowId}`}
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

export default BorrowDigitalsTab
