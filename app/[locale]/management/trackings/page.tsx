import React from "react"
import { Link } from "@/i18n/routing"
import { auth } from "@/queries/auth"
import getTrackings from "@/queries/trackings/get-trackings"
import { format } from "date-fns"
import { Eye, MoreHorizontal } from "lucide-react"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { formatPrice } from "@/lib/utils"
import { searchTrackingsSchema } from "@/lib/validations/trackings/search-trackings"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import NoData from "@/components/ui/no-data"
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
import TrackingStatusBadge from "@/components/ui/tracking-status-badge"
import TrackingTypeBadge from "@/components/ui/tracking-type-badge"

import CreateTrackingDialog from "./_components/create-tracking-dialog"
import FiltersTrackingsDialog from "./_components/filters-tracking-dialog"

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

async function WarehouseTrackingsManagementPage({ searchParams }: Props) {
  await auth().protect(EFeature.WAREHOUSE_TRACKING_MANAGEMENT)
  const t = await getTranslations("TrackingsManagementPage")
  const formatLocale = await getFormatLocale()

  const { search, pageIndex, sort, pageSize, ...rest } =
    searchTrackingsSchema.parse(searchParams)

  const {
    sources: trackings,
    totalActualItem,
    totalPage,
  } = await getTrackings({
    search,
    pageIndex,
    sort,
    pageSize,
    ...rest,
  })

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Warehouse trackings")}</h3>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-row items-center">
            <SearchForm
              className="h-full rounded-r-none border-r-0"
              search={search}
            />
            <FiltersTrackingsDialog />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-4">
          <CreateTrackingDialog />
        </div>
      </div>

      <div className="mt-4 grid w-full">
        <div className="overflow-x-auto rounded-md border">
          <Table className="overflow-hidden">
            <TableHeader className="">
              <TableRow className="">
                <SortableTableHead
                  currentSort={sort}
                  label={t("Receipt number")}
                  sortKey="ReceiptNumber"
                />

                <SortableTableHead
                  currentSort={sort}
                  label={t("Supplier name")}
                  sortKey="SupplierName"
                />

                <SortableTableHead
                  currentSort={sort}
                  label={t("Total item")}
                  sortKey="TotalItem"
                  position="center"
                />

                <SortableTableHead
                  currentSort={sort}
                  label={t("Total amount")}
                  sortKey="TotalAmount"
                  position="center"
                />

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">
                    {t("Tracking type")}
                  </div>
                </TableHead>

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-start">{t("Status")}</div>
                </TableHead>

                <SortableTableHead
                  currentSort={sort}
                  label={t("Entry date")}
                  sortKey="EntryDate"
                />

                <SortableTableHead
                  currentSort={sort}
                  label={t("Expected return date")}
                  sortKey="ExpectedReturnDate"
                />

                <SortableTableHead
                  currentSort={sort}
                  label={t("Actual return date")}
                  sortKey="ActualReturnDate"
                />

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-start">
                    {t("Transfer location")}
                  </div>
                </TableHead>

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-start">{t("Description")}</div>
                </TableHead>

                <SortableTableHead
                  currentSort={sort}
                  label={t("Created at")}
                  sortKey="CreatedAt"
                />

                <TableHead className="text-nowrap font-bold">
                  {t("Created by")}
                </TableHead>

                <SortableTableHead
                  currentSort={sort}
                  label={t("Updated at")}
                  sortKey="UpdatedAt"
                />
                <TableHead className="text-nowrap font-bold">
                  {t("Updated by")}
                </TableHead>

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">{t("Actions")}</div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trackings.map((tracking) => (
                <TableRow key={tracking.trackingId}>
                  <TableCell className="text-nowrap font-bold">
                    {tracking.receiptNumber}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {tracking?.supplier?.supplierName}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {tracking.totalItem || "-"}
                    </div>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <div className="flex justify-center">
                      {tracking.totalAmount
                        ? formatPrice(tracking.totalAmount)
                        : "-"}
                    </div>
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <TrackingTypeBadge type={tracking.trackingType} />
                  </TableCell>

                  <TableCell className="text-nowrap">
                    <TrackingStatusBadge status={tracking.status} />
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {format(new Date(tracking.entryDate), "dd MMM yyyy", {
                      locale: formatLocale,
                    })}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {tracking.expectedReturnDate
                      ? format(
                          new Date(tracking.expectedReturnDate),
                          "dd MMM yyyy",
                          { locale: formatLocale }
                        )
                      : "-"}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {tracking.actualReturnDate
                      ? format(
                          new Date(tracking.actualReturnDate),
                          "dd MMM yyyy",
                          { locale: formatLocale }
                        )
                      : "-"}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {tracking.transferLocation || "-"}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {tracking.description || "-"}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {tracking.createdAt
                      ? format(new Date(tracking.createdAt), "dd MMM yyyy", {
                          locale: formatLocale,
                        })
                      : "-"}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {tracking.createdBy || "-"}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {tracking.updatedAt
                      ? format(new Date(tracking.updatedAt), "dd MMM yyyy", {
                          locale: formatLocale,
                        })
                      : "-"}
                  </TableCell>

                  <TableCell className="text-nowrap">
                    {tracking.updatedBy || "-"}
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
                              href={`/management/trackings/${tracking.trackingId}`}
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
          {trackings.length === 0 && (
            <div className="flex justify-center p-4">
              <NoData />
            </div>
          )}
        </div>

        <Paginator
          pageSize={+pageSize}
          pageIndex={pageIndex}
          totalPage={totalPage}
          totalActualItem={totalActualItem}
          className="mt-6"
        />
      </div>
    </div>
  )
}

export default WarehouseTrackingsManagementPage
