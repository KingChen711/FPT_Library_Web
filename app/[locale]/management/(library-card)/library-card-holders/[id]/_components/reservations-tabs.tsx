/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { Check, Eye, Loader2, MoreHorizontal, X } from "lucide-react"
import { useTranslations } from "next-intl"

import { type TSearchBorrowReservationsSchema } from "@/lib/validations/reservations/search-reservations"
import usePatronReservations from "@/hooks/patrons/use-patron-reservations"
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
import ReservationStatusBadge from "@/components/badges/reservation-status-badge"

type Props = {
  userId: string
}

const initSearchParams: TSearchBorrowReservationsSchema = {
  pageIndex: 1,
  pageSize: "5",
  search: "",
  expiryDateRange: [null, null],
  assignDateRange: [null, null],
  collectedDateRange: [null, null],
  expectedAvailableDateMaxRange: [null, null],
  expectedAvailableDateMinRange: [null, null],
  reservationDateRange: [null, null],
}

function ReservationsTab({ userId }: Props) {
  const t = useTranslations("BorrowAndReturnManagementPage")
  const formatLocale = useFormatLocale()
  const [searchParams, setSearchParams] =
    useState<TSearchBorrowReservationsSchema>(initSearchParams)

  const { data } = usePatronReservations(userId, searchParams)

  if (!data) {
    return (
      <TabsContent value="tracking-details">
        <Loader2 className="size-9 animate-spin" />
      </TabsContent>
    )
  }

  return (
    <TabsContent value="reservations">
      <div className="grid w-full">
        <div className="overflow-x-auto rounded-md border">
          <Table className="overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead className="text-nowrap font-bold">
                  {t("Library item")}
                </TableHead>

                <SortableTableHead
                  disabled
                  currentSort={searchParams.sort}
                  label={t("Reservation code")}
                  sortKey="ReservationCode"
                  position="left"
                />
                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">{t("Status")}</div>
                </TableHead>

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">{t("Assignable")}</div>
                </TableHead>

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">
                    {t("Applied label")}
                  </div>
                </TableHead>

                <SortableTableHead
                  disabled
                  currentSort={searchParams.sort}
                  label={t("Reservation date")}
                  sortKey="ReservationDate"
                  position="center"
                />

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">{t("Actions")}</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.sources?.map((reservation) => (
                <TableRow key={reservation.queueId}>
                  <TableCell className="text-nowrap">
                    <Link
                      target="_blank"
                      href={`/management/books/${reservation.libraryItem.libraryItemId}`}
                      className="group flex items-center gap-2 pr-8"
                    >
                      {reservation.libraryItem.coverImage ? (
                        <Image
                          alt={reservation.libraryItem.title}
                          src={reservation.libraryItem.coverImage}
                          width={40}
                          height={60}
                          className="aspect-[2/3] h-12 w-8 rounded-sm border object-cover"
                        />
                      ) : (
                        <div className="h-12 w-8 rounded-sm border"></div>
                      )}
                      <p className="font-bold group-hover:underline">
                        {reservation.libraryItem.title}
                      </p>
                    </Link>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <div className="flex">
                      {reservation.reservationCode || "-"}
                    </div>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      <ReservationStatusBadge
                        status={reservation.queueStatus}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {reservation.isAssignable ? (
                        <Check className="text-success" />
                      ) : (
                        <X className="text-danger" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {reservation.isAppliedLabel ? (
                        <Check className="text-success" />
                      ) : (
                        <X className="text-danger" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {format(
                        new Date(reservation.reservationDate),
                        "dd MMM yyyy",
                        {
                          locale: formatLocale,
                        }
                      )}
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
                              href={`/management/borrows/reservations/${reservation.queueId}`}
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

export default ReservationsTab
