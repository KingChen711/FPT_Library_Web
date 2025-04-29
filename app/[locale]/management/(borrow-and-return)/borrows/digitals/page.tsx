import React from "react"
import Link from "next/link"
import { auth } from "@/queries/auth"
import getBorrowDigitals from "@/queries/borrows/get-borrow-digitals"
import { format } from "date-fns"
import { Eye, MoreHorizontal } from "lucide-react"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { formatFileSize, formatPrice, getFullName } from "@/lib/utils"
import { searchBorrowDigitalsManagementSchema } from "@/lib/validations/borrow-digitals-management/search-borrow-digitals-management"
import BorrowDigitalStatusBadge from "@/components/ui/borrow-digital-status-badge"
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
import ResourceBookTypeBadge from "@/components/badges/book-resource-type-badge"

import FiltersBorrowDigitalsDialog from "./_components/filters-borow-digitals-dialog"

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

async function BorrowDigitalsManagementPage({ searchParams }: Props) {
  await auth().protect(EFeature.BORROW_MANAGEMENT)

  const t = await getTranslations("BorrowAndReturnManagementPage")

  const formatLocale = await getFormatLocale()

  const { search, pageIndex, sort, pageSize, ...rest } =
    searchBorrowDigitalsManagementSchema.parse(searchParams)

  const {
    sources: borrowDigitals,
    totalActualItem,
    totalPage,
  } = await getBorrowDigitals({
    search,
    pageIndex,
    sort,
    pageSize,
    ...rest,
  })

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Borrow digitals")}</h3>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-row items-center">
            <SearchForm
              className="h-10 rounded-r-none border-r-0"
              search={search}
            />
            <FiltersBorrowDigitalsDialog />
          </div>
        </div>
      </div>

      {borrowDigitals.length === 0 ? (
        <div className="flex justify-center p-4">
          <NoResult
            title={t("Borrow Digitals Not Found")}
            description={t(
              "No borrow digitals matching your request were found Please check your information or try searching with different criteria"
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
                    <div className="flex justify-center">
                      {t("Borrow price")}
                    </div>
                  </TableHead>

                  <SortableTableHead
                    currentSort={sort}
                    label={t("Borrow date")}
                    sortKey="RegisterDate"
                    position="center"
                  />

                  <SortableTableHead
                    currentSort={sort}
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
                {borrowDigitals.map((digital) => (
                  <TableRow key={digital.digitalBorrowId}>
                    <TableCell className="text-nowrap">
                      <Link
                        target="_blank"
                        href={`/management/library-card-holders/${digital?.userId}`}
                        className="group flex items-center gap-2"
                      >
                        <p className="group-hover:underline">
                          {getFullName(
                            digital.user.firstName,
                            digital.user.lastName
                          )}
                        </p>
                      </Link>
                    </TableCell>
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
                        {digital.libraryResource.defaultBorrowDurationDays ??
                          "-"}
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

export default BorrowDigitalsManagementPage
