import React from "react"
import Link from "next/link"
import { auth } from "@/queries/auth"
import getBorrowRecords from "@/queries/borrows/get-borrow-records"
import { format } from "date-fns"
import { Check, Eye, MoreHorizontal, Plus, X } from "lucide-react"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { searchBorrowRecordsSchema } from "@/lib/validations/borrow-records/search-borrow-records"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/ui/icons"
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
import BorrowTypeBadge from "@/components/badges/borrow-type-bade"

import FiltersBorrowRecordsDialog from "./_components/filters-borrow-records-dialog"

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

async function BorrowRecordsManagementPage({ searchParams }: Props) {
  await auth().protect(EFeature.BORROW_MANAGEMENT)

  const t = await getTranslations("BorrowAndReturnManagementPage")

  const formatLocale = await getFormatLocale()

  const { search, pageIndex, sort, pageSize, ...rest } =
    searchBorrowRecordsSchema.parse(searchParams)

  const {
    sources: borrowRecords,
    totalActualItem,
    totalPage,
  } = await getBorrowRecords({
    search,
    pageIndex,
    sort,
    pageSize,
    ...rest,
  })

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Borrow records")}</h3>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-row items-center">
            <SearchForm
              className="h-10 rounded-r-none border-r-0"
              search={search}
            />
            <FiltersBorrowRecordsDialog />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-4">
          <Button asChild variant="outline">
            <Link href="/management/return">
              <Icons.Return className="size-4" />
              {t("Return items")}
            </Link>
          </Button>
          <Button asChild>
            <Link href="/management/borrows/records/create">
              <Plus />
              {t("Create borrow record")}
            </Link>
          </Button>
        </div>
      </div>

      {borrowRecords.length === 0 ? (
        <div className="flex justify-center p-4">
          <NoResult
            title={t("Borrow Records Not Found")}
            description={t(
              "No borrow records matching your request were found Please check your information or try searching with different criteria"
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
                    label={t("Borrow date")}
                    sortKey="BorrowDate"
                    position="center"
                  />
                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Borrow type")}
                    </div>
                  </TableHead>
                  <SortableTableHead
                    currentSort={sort}
                    label={t("Total record items")}
                    sortKey="TotalRecordItem"
                    position="center"
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
                {borrowRecords.map((record) => (
                  <TableRow key={record.borrowRecordId}>
                    <TableCell className="text-nowrap">
                      <Link
                        target="_blank"
                        href={`/management/library-cards/${record.librarycard.libraryCardId}`}
                        className="group flex items-center gap-2"
                      >
                        <p className="group-hover:underline">
                          {record.librarycard?.fullName}
                        </p>
                      </Link>
                    </TableCell>
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

export default BorrowRecordsManagementPage
