import React from "react"
import { Link } from "@/i18n/routing"
import { auth } from "@/queries/auth"
import getBorrowRequests from "@/queries/borrows/get-borrow-requests"
import { format } from "date-fns"
import { Check, Eye, MoreHorizontal, X } from "lucide-react"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { searchBorrowRequestsSchema } from "@/lib/validations/borrow-requests/search-borrow-requests"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import BorrowRequestStatusBadge from "@/components/badges/borrow-request-status-badge"

import FiltersBorrowRequestsDialog from "./_components/filter-borrow-requests-dialog"

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

async function BorrowRequestsManagementPage({ searchParams }: Props) {
  await auth().protect(EFeature.BORROW_MANAGEMENT)

  const t = await getTranslations("BorrowAndReturnManagementPage")

  const formatLocale = await getFormatLocale()

  const { search, pageIndex, sort, pageSize, ...rest } =
    searchBorrowRequestsSchema.parse(searchParams)

  const {
    sources: borrowRequests,
    totalActualItem,
    totalPage,
  } = await getBorrowRequests({
    search,
    pageIndex,
    sort,
    pageSize,
    ...rest,
  })

  console.log(borrowRequests)

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Borrow requests")}</h3>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-row items-center">
            <SearchForm
              className="h-full rounded-r-none border-r-0"
              search={search}
            />
            <FiltersBorrowRequestsDialog />
          </div>
        </div>
      </div>

      {borrowRequests.length === 0 ? (
        <div className="flex justify-center p-4">
          <NoResult
            title={t("Borrow Requests Not Found")}
            description={t(
              "No borrow requests matching your request were found Please check your information or try searching with different criteria"
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
                    {t("Patron")}
                  </TableHead>
                  <SortableTableHead
                    currentSort={sort}
                    label={t("Request date")}
                    sortKey="RequestDate"
                    position="center"
                  />
                  <SortableTableHead
                    currentSort={sort}
                    label={t("Expiration date")}
                    sortKey="ExpirationDate"
                    position="center"
                  />
                  <SortableTableHead
                    currentSort={sort}
                    label={t("Total request items")}
                    sortKey="TotalRequestItem"
                    position="center"
                  />
                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">{t("Status")}</div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Reminder sent")}
                    </div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Description")}
                    </div>
                  </TableHead>

                  <SortableTableHead
                    currentSort={sort}
                    label={t("Cancelled at")}
                    sortKey="CancelledAt"
                    position="center"
                  />

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Cancellation reason")}
                    </div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">{t("Actions")}</div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {borrowRequests.map((request) => (
                  <TableRow key={request.borrowRequestId}>
                    <TableCell className="text-nowrap">
                      <Link
                        target="_blank"
                        href={`/management/library-cards/${request.libraryCard.libraryCardId}`}
                        className="group flex items-center gap-2"
                      >
                        <Avatar className="size-8">
                          <AvatarImage
                            src={request.libraryCard?.avatar || ""}
                          />
                          <AvatarFallback>
                            {request.libraryCard?.fullName
                              .split(" ")
                              .map((i) => i[0].toUpperCase())
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <p className="group-hover:underline">
                          {request.libraryCard?.fullName}
                        </p>
                      </Link>
                    </TableCell>
                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {format(new Date(request.requestDate), "dd MMM yyyy", {
                          locale: formatLocale,
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {format(
                          new Date(request.expirationDate),
                          "dd MMM yyyy",
                          {
                            locale: formatLocale,
                          }
                        )}
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
                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {request.isReminderSent ? (
                          <Check className="text-success" />
                        ) : (
                          <X className="text-danger" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {request.description ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                {t("View content")}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[80vh] overflow-y-auto overflow-x-hidden">
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
                      <div className="flex justify-center">
                        {request.cancelledAt
                          ? format(
                              new Date(request.cancelledAt),
                              "dd MMM yyyy HH:mm",
                              {
                                locale: formatLocale,
                              }
                            )
                          : "-"}
                      </div>
                    </TableCell>
                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {request.cancellationReason ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                {t("View content")}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[80vh] overflow-y-auto overflow-x-hidden">
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

export default BorrowRequestsManagementPage
