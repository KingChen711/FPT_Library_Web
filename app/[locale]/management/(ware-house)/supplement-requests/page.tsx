import React from "react"
import Link from "next/link"
import { auth } from "@/queries/auth"
import getSupplementRequests from "@/queries/trackings/get-supplement-request"
import { format } from "date-fns"
import { Eye, MoreHorizontal, Plus } from "lucide-react"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { formatPrice } from "@/lib/utils"
import { searchSupplementRequestsSchema } from "@/lib/validations/trackings/search-supplement-requests"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import NoData from "@/components/ui/no-data"
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
import TrackingStatusBadge from "@/components/badges/tracking-status-badge"
import TrackingTypeBadge from "@/components/badges/tracking-type-badge"

import FiltersSupplementRequestsDialog from "./create/_components/filters-supplement-request-dialog"

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

async function WarehouseSupplementRequestsManagementPage({
  searchParams,
}: Props) {
  await auth().protect(EFeature.WAREHOUSE_TRACKING_MANAGEMENT)
  const t = await getTranslations("TrackingsManagementPage")
  const formatLocale = await getFormatLocale()

  const { search, pageIndex, sort, pageSize, ...rest } =
    searchSupplementRequestsSchema.parse(searchParams)

  const {
    sources: supplementRequests,
    totalActualItem,
    totalPage,
  } = await getSupplementRequests({
    search,
    pageIndex,
    sort,
    pageSize,
    ...rest,
  })

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Supplement requests")}</h3>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-row items-center">
            <SearchForm
              className="h-10 rounded-r-none border-r-0"
              search={search}
            />
            <FiltersSupplementRequestsDialog />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-4">
          <Button asChild>
            <Link href="/management/supplement-requests/create">
              <Plus />
              {t("Create supplement request")}
            </Link>
          </Button>
        </div>
      </div>

      {supplementRequests.length === 0 ? (
        <div className="flex justify-center p-4">
          <NoResult
            title={t("Supplement requests Not Found")}
            description={t(
              "No supplement requests matching your request were found Please check your information or try searching with different criteria"
            )}
          />
        </div>
      ) : (
        <div className="mt-4 grid w-full">
          <div className="overflow-x-auto rounded-md border">
            <Table className="overflow-hidden">
              <TableHeader>
                <TableRow>
                  <SortableTableHead
                    currentSort={sort}
                    label={t("Receipt number")}
                    sortKey="ReceiptNumber"
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
                    <div className="flex justify-center">{t("Status")}</div>
                  </TableHead>

                  <SortableTableHead
                    currentSort={sort}
                    label={t("Entry date")}
                    sortKey="EntryDate"
                    position="center"
                  />

                  <SortableTableHead
                    currentSort={sort}
                    label={t("Data finalization date")}
                    sortKey="DataFinalizationDate"
                    position="center"
                  />

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Description")}
                    </div>
                  </TableHead>

                  <SortableTableHead
                    currentSort={sort}
                    label={t("Create at")}
                    sortKey="CreatedAt"
                    position="center"
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
                {supplementRequests.map((tracking) => (
                  <TableRow key={tracking.trackingId}>
                    <TableCell className="text-nowrap font-bold">
                      {tracking.receiptNumber}
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
                      <div className="flex justify-center">
                        <TrackingTypeBadge type={tracking.trackingType} />
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        <TrackingStatusBadge status={tracking.status} />
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {format(new Date(tracking.entryDate), "dd MMM yyyy", {
                          locale: formatLocale,
                        })}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {tracking.dataFinalizationDate
                          ? format(
                              new Date(tracking.dataFinalizationDate),
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
                        {tracking.description || "-"}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {tracking.createdAt
                          ? format(
                              new Date(tracking.createdAt),
                              "HH:mm dd MMM yyyy",
                              {
                                locale: formatLocale,
                              }
                            )
                          : "-"}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      {tracking.createdBy || "-"}
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {tracking.updatedAt
                          ? format(
                              new Date(tracking.updatedAt),
                              "HH:mm dd MMM yyyy",
                              {
                                locale: formatLocale,
                              }
                            )
                          : "-"}
                      </div>
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
                                href={`/management/supplement-requests/${tracking.trackingId}`}
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
            {supplementRequests.length === 0 && (
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
      )}
    </div>
  )
}

export default WarehouseSupplementRequestsManagementPage
