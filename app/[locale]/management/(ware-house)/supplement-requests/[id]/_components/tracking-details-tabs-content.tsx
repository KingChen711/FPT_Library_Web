/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { useLocale, useTranslations } from "next-intl"

import { type EBookCopyConditionStatus } from "@/lib/types/enums"
import { type Condition } from "@/lib/types/models"
import { formatPrice } from "@/lib/utils"
import { type TSearchTrackingDetailsSchema } from "@/lib/validations/trackings/search-tracking-details"
import useTrackingDetails from "@/hooks/trackings/use-search-tracking-details"
import useFormatLocale from "@/hooks/utils/use-format-locale"
import Paginator from "@/components/ui/paginator"
import SearchForm from "@/components/ui/search-form"
import SortableTableHead from "@/components/ui/sortable-table-head"
import StockTransactionTypeBadge from "@/components/ui/stock-transaction-type-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"
import BookConditionStatusBadge from "@/components/badges/book-condition-status-badge"

import { TrackingDetailsSectionSkeleton } from "../../../trackings/[id]/_components/tracking-details-section"
import { FiltersTrackingDetailsDropdown } from "../../../trackings/[id]/_components/tracking-details-section/filters-tracking-details-dropdown"
import TrackingDetailActionsDropdown from "../../../trackings/[id]/_components/tracking-details-section/tracking-detail-actions-dropdown"

const initSearchParams: TSearchTrackingDetailsSchema = {
  pageIndex: 1,
  pageSize: "5",
  search: "",
  f: [],
  o: [],
  v: [],
}

type Props = {
  trackingId: number
  conditions: Condition[]
}

function TrackingDetailsTabsContent({ trackingId, conditions }: Props) {
  const t = useTranslations("TrackingsManagementPage")
  const [searchParams, setSearchParams] =
    useState<TSearchTrackingDetailsSchema>(initSearchParams)

  const { data } = useTrackingDetails(trackingId, searchParams)

  const locale = useLocale()
  const formatLocale = useFormatLocale()

  if (!data) {
    return (
      <TabsContent value="tracking-details">
        <TrackingDetailsSectionSkeleton />
      </TabsContent>
    )
  }

  const { result } = data

  const handleSort = (sortKey: any) =>
    setSearchParams((prev) => ({
      ...prev,
      sort: sortKey,
      pageIndex: 1,
    }))

  const handleSearch = (val: string) => {
    setSearchParams((prev) => ({
      ...prev,
      search: val,
      pageIndex: 1,
    }))
  }

  return (
    <TabsContent value="tracking-details">
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-semibold">{t("Tracking details")}</h3>

        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-row items-center">
              <SearchForm
                className="h-full rounded-r-none border-r-0"
                search={searchParams.search}
                onSearch={handleSearch}
              />
              <FiltersTrackingDetailsDropdown
                trackingId={trackingId}
                supplementRequest
                searchParams={searchParams}
                setSearchParams={setSearchParams}
              />
            </div>
          </div>
        </div>

        <div className="grid w-full">
          <div className="overflow-x-auto rounded-md border">
            <Table className="overflow-hidden">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Stock transaction type")}
                    </div>
                  </TableHead>

                  <SortableTableHead
                    currentSort={searchParams.sort}
                    label={t("Item name")}
                    sortKey="ItemName"
                    onSort={handleSort}
                  />

                  <SortableTableHead
                    currentSort={searchParams.sort}
                    label="ISBN"
                    sortKey="ISBN"
                    position="center"
                    onSort={handleSort}
                  />

                  <TableHead className="text-nowrap font-bold">
                    {t("Category")}
                  </TableHead>

                  <SortableTableHead
                    currentSort={searchParams.sort}
                    label={t("Total item")}
                    sortKey="ItemTotal"
                    position="center"
                    onSort={handleSort}
                  />

                  <SortableTableHead
                    currentSort={searchParams.sort}
                    label={t("Unit price")}
                    sortKey="UnitPrice"
                    position="center"
                    onSort={handleSort}
                  />

                  <SortableTableHead
                    currentSort={searchParams.sort}
                    label={t("Total amount")}
                    sortKey="TotalAmount"
                    position="center"
                    onSort={handleSort}
                  />

                  <TableHead className="text-nowrap font-bold">
                    {t("Condition")}
                  </TableHead>

                  <SortableTableHead
                    currentSort={searchParams.sort}
                    label={t("Created at")}
                    sortKey="CreatedAt"
                    position="center"
                    onSort={handleSort}
                  />

                  <SortableTableHead
                    currentSort={searchParams.sort}
                    label={t("Created by")}
                    sortKey="CreatedBy"
                    position="center"
                    onSort={handleSort}
                  />

                  <SortableTableHead
                    currentSort={searchParams.sort}
                    label={t("Updated at")}
                    sortKey="UpdatedAt"
                    position="center"
                    onSort={handleSort}
                  />

                  <SortableTableHead
                    currentSort={searchParams.sort}
                    label={t("Updated by")}
                    sortKey="UpdatedBy"
                    position="center"
                    onSort={handleSort}
                  />

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">{t("Actions")}</div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.sources.map((trackingDetail) => (
                  <TableRow key={trackingDetail.trackingDetailId}>
                    <TableCell className="text-nowrap font-bold">
                      <div className="flex justify-center">
                        <StockTransactionTypeBadge
                          type={trackingDetail.stockTransactionType}
                        />
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      {trackingDetail.libraryItem ? (
                        <Link
                          target="_blank"
                          href={`/management/books/${trackingDetail.libraryItem.libraryItemId}`}
                          className="group flex items-center gap-2 pr-8"
                        >
                          {trackingDetail.libraryItem.coverImage ? (
                            <Image
                              alt={trackingDetail.libraryItem.title}
                              src={trackingDetail.libraryItem.coverImage}
                              width={40}
                              height={60}
                              className="aspect-[2/3] h-12 w-8 rounded-sm border object-cover"
                            />
                          ) : (
                            <div className="h-12 w-8 rounded-sm border"></div>
                          )}
                          <p className="font-bold group-hover:underline">
                            {trackingDetail.libraryItem.title}
                          </p>
                        </Link>
                      ) : (
                        <div className="flex font-bold">
                          {trackingDetail.itemName}
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="text-nowrap">
                      {trackingDetail.isbn}
                    </TableCell>

                    <TableCell className="text-nowrap">
                      {locale === "vi"
                        ? trackingDetail.category.vietnameseName
                        : trackingDetail.category.englishName}
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {trackingDetail.itemTotal}
                      </div>
                    </TableCell>
                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {formatPrice(trackingDetail.unitPrice)}
                      </div>
                    </TableCell>
                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {formatPrice(trackingDetail.totalAmount)}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        <BookConditionStatusBadge
                          status={
                            conditions?.find(
                              (c) =>
                                c.conditionId === trackingDetail.conditionId
                            )?.englishName as EBookCopyConditionStatus
                          }
                        />
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {trackingDetail.createdAt
                          ? format(
                              new Date(trackingDetail.createdAt),
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
                        {trackingDetail.createdBy || "-"}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {trackingDetail.updatedAt
                          ? format(
                              new Date(trackingDetail.updatedAt),
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
                        {trackingDetail.updatedBy || "-"}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        <TrackingDetailActionsDropdown
                          supplementRequest
                          trackingDetail={trackingDetail}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {result.sources.length > 0 && (
          <Paginator
            pageSize={+result.pageSize}
            pageIndex={result.pageIndex}
            totalPage={result.totalPage}
            totalActualItem={result.totalActualItem}
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

export default TrackingDetailsTabsContent
