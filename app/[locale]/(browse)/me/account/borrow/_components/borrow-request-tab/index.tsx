import Link from "next/link"
import getBorrowRequestsPatron from "@/queries/borrows/get-borrow-requests-patron"
import { format } from "date-fns"
import { Eye, MoreHorizontal } from "lucide-react"

import { getTranslations } from "@/lib/get-translations"
import { searchBorrowRequestsSchema } from "@/lib/validations/borrow-requests/search-borrow-requests"
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
import BorrowRequestStatusBadge from "@/components/badges/borrow-request-status-badge"

import FiltersBorrowRequestsDialog from "./filter-borrow-requests-dialog"

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

export default async function BorrowRequestTab({ searchParams }: Props) {
  const t = await getTranslations("BookPage.borrow tracking")

  const { search, pageIndex, sort, pageSize, ...rest } =
    searchBorrowRequestsSchema.parse(searchParams)

  const {
    sources: borrowRequests,
    totalActualItem,
    totalPage,
  } = await getBorrowRequestsPatron({
    search,
    pageIndex,
    sort,
    pageSize,
    ...rest,
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div className="flex flex-row items-center">
          <SearchForm
            className="h-full rounded-r-none border-r-0"
            search={search}
          />
          <FiltersBorrowRequestsDialog />
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
                    <div className="flex justify-center">
                      {t("ordinal number")}
                    </div>
                  </TableHead>
                  <SortableTableHead
                    currentSort={sort}
                    label={t("request date")}
                    sortKey="RequestDate"
                    position="center"
                  />
                  <SortableTableHead
                    currentSort={sort}
                    label={t("expiration date")}
                    sortKey="ExpirationDate"
                    position="center"
                  />
                  <SortableTableHead
                    currentSort={sort}
                    label={t("total request items")}
                    sortKey="TotalRequestItem"
                    position="center"
                  />
                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">{t("status")}</div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">{t("actions")}</div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {borrowRequests.map((request, index) => (
                  <TableRow key={request.borrowRequestId}>
                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">{index + 1}</div>
                    </TableCell>
                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {format(
                          new Date(request.requestDate),
                          "HH:mm dd/MM/yyyy"
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {request.expirationDate
                          ? format(
                              new Date(request.expirationDate),
                              "HH:mm dd/MM/yyyy"
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
                                href={`/me/account/borrow/request/${request.borrowRequestId}`}
                                className="flex items-center gap-2"
                              >
                                <Eye className="size-4" />
                                {t("view details")}
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
