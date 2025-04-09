"use client"

import React, { useState } from "react"
import { format } from "date-fns"
import { useTranslations } from "next-intl"

import { type TSearchAuditsSchema } from "@/lib/validations/audits/search-audits"
import useAudits from "@/hooks/audits/use-audits"
import useFormatLocale from "@/hooks/utils/use-format-locale"
import AuditTypeBadge from "@/components/ui/audit-type-badge"
import NoData from "@/components/ui/no-data"
import Paginator from "@/components/ui/paginator"
import { Skeleton } from "@/components/ui/skeleton"
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

import DetailChangeDialog from "./detail-change-dialog"

type Props = {
  bookId: number
}

const initSearchParams: TSearchAuditsSchema = {
  entityId: 0, //assign inside main component
  entityName: "LibraryItem",
  pageIndex: 1,
  pageSize: "5",
  search: "",
  sort: "-DateUtc",
}

function HistoriesTabsContent({ bookId }: Props) {
  const t = useTranslations("BooksManagementPage")
  const formatLocale = useFormatLocale()

  const [searchParams, setSearchParams] = useState({
    ...initSearchParams,
    entityId: bookId,
  })

  const { data, isPending } = useAudits(searchParams)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSort = (sortKey: any) =>
    setSearchParams((prev) => ({
      ...prev,
      sort: sortKey,
      pageIndex: 1,
    }))

  return (
    <TabsContent value="histories">
      <div className="mt-4 grid w-full">
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableTableHead
                  currentSort={searchParams.sort}
                  label={t("When")}
                  sortKey="DateUtc"
                  onSort={handleSort}
                />
                <SortableTableHead
                  currentSort={searchParams.sort}
                  label={t("Who")}
                  sortKey="Email"
                  onSort={handleSort}
                />
                <TableHead>
                  <div className="flex justify-center text-nowrap font-bold">
                    {t("Type")}
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex justify-center text-nowrap font-bold">
                    {t("Details")}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending &&
                [...Array(5)].map((_, rowIdx) => (
                  <TableRow key={rowIdx}>
                    <TableCell colSpan={4}>
                      <Skeleton className="h-9 w-full" />
                    </TableCell>
                  </TableRow>
                ))}
              {!isPending && (!data?.sources || data.sources.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <div className="flex justify-center p-4">
                      <NoData />
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {data?.sources?.map((audit) => (
                <TableRow key={audit.auditTrailId}>
                  <TableCell>
                    <div className="flex text-nowrap">
                      {format(new Date(audit.dateUtc), "HH:mm dd MMM yyyy", {
                        locale: formatLocale,
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex text-nowrap">{audit.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center text-nowrap">
                      <AuditTypeBadge status={audit.trailType} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <DetailChangeDialog
                        dateUtc={audit.dateUtc}
                        trailType={audit.trailType}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      {data && (
        <Paginator
          pageSize={+searchParams.pageSize}
          pageIndex={searchParams.pageIndex}
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
    </TabsContent>
  )
}

export default HistoriesTabsContent
