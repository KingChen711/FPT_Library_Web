import React from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import { auth } from "@/queries/auth"
import getBorrowReservations from "@/queries/borrows/get-reservations"
import { format } from "date-fns"
import { Check, Eye, MoreHorizontal, X } from "lucide-react"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { searchBorrowReservationsSchema } from "@/lib/validations/reservations/search-reservations"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import NoResult from "@/components/ui/no-result"
import Paginator from "@/components/ui/paginator"
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
import ReservationStatusBadge from "@/components/badges/reservation-status-badge"

import FiltersBorrowReservationsDialog from "./_components/filter-borrow-reservations-dialog"

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

async function BorrowReservationsManagementPage({ searchParams }: Props) {
  await auth().protect(EFeature.BORROW_MANAGEMENT)

  const t = await getTranslations("BorrowAndReturnManagementPage")

  const formatLocale = await getFormatLocale()

  const { search, pageIndex, sort, pageSize, ...rest } =
    searchBorrowReservationsSchema.parse(searchParams)

  const {
    sources: borrowReservations,
    totalActualItem,
    totalPage,
  } = await getBorrowReservations({
    search,
    pageIndex,
    sort,
    pageSize,
    ...rest,
  })

  console.log(borrowReservations)

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Borrow reservations")}</h3>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-row items-center">
            <SearchForm
              className="h-full rounded-r-none border-r-0"
              search={search}
            />
            <FiltersBorrowReservationsDialog />
          </div>
        </div>
      </div>

      {borrowReservations.length === 0 ? (
        <div className="flex justify-center p-4">
          <NoResult
            title={t("Borrow Reservations Not Found")}
            description={t(
              "No borrow reservations matching your request were found Please check your information or try searching with different criteria"
            )}
          />
        </div>
      ) : (
        <div className="mt-4 grid w-full">
          <div className="overflow-x-auto rounded-md border">
            <Table className="overflow-hidden">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-nowrap font-bold">
                    {t("Library item")}
                  </TableHead>
                  <TableHead className="text-nowrap font-bold">
                    {t("Patron")}
                  </TableHead>
                  <SortableTableHead
                    currentSort={sort}
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
                    currentSort={sort}
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
                {borrowReservations.map((reservation) => (
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
                      <Link
                        target="_blank"
                        href={`/management/library-cards/${reservation.libraryCard.libraryCardId}`}
                        className="group flex items-center gap-2"
                      >
                        <p className="group-hover:underline">
                          {reservation.libraryCard?.fullName}
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

export default BorrowReservationsManagementPage
