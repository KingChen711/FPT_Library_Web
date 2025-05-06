/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState } from "react"
import { format } from "date-fns"
import { HistoryIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { type TSearchAuditsSchema } from "@/lib/validations/audits/search-audits"
import useRoleHistories from "@/hooks/audits/use-role-histories"
import useFormatLocale from "@/hooks/utils/use-format-locale"
import AuditTypeBadge from "@/components/ui/audit-type-badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import NoData from "@/components/ui/no-data"
import NoResult from "@/components/ui/no-result"
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

const initSearchParams: TSearchAuditsSchema = {
  pageIndex: 1,
  pageSize: "5",
  search: "",
  entityId: 0,
  entityName: "SystemRole",
  sort: "-DateUtc",
}

function HistoriesDialog() {
  const t = useTranslations("RoleManagement")
  const formatLocale = useFormatLocale()

  const [searchParams, setSearchParams] =
    useState<TSearchAuditsSchema>(initSearchParams)

  const { data, isLoading } = useRoleHistories(searchParams)

  const handleSort = (sortKey: any) =>
    setSearchParams((prev) => ({
      ...prev,
      sort: sortKey,
      pageIndex: 1,
    }))

  if (isLoading) {
    return <Skeleton className="h-9 w-[164px]" />
  }

  if (!data) return

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center justify-end gap-x-1 leading-none"
        >
          <HistoryIcon />
          <div>{t("Changes history")}</div>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-7xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Changes history")}</DialogTitle>
          <DialogDescription asChild>
            <div>
              {data?.sources.length === 0 ? (
                <div className="flex justify-center p-4">
                  <NoResult
                    title={t("Role histories Not Found")}
                    description={t(
                      "No role histories matching your request were found Please check your information or try searching with different criteria"
                    )}
                  />
                </div>
              ) : (
                <div className="mt-4 grid w-full">
                  <div className="overflow-x-auto rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <SortableTableHead
                            currentSort={searchParams.sort}
                            onSort={handleSort}
                            label={t("When")}
                            sortKey="DateUtc"
                          />

                          <TableHead>
                            <div className="flex text-nowrap font-bold">
                              {t("Change")}
                            </div>
                          </TableHead>
                          <TableHead>
                            <div className="flex justify-center text-nowrap font-bold">
                              {t("Type")}
                            </div>
                          </TableHead>
                          {/* <TableHead>
                    <div className="flex justify-center text-nowrap font-bold">
                      {t("Details")}
                    </div>
                  </TableHead> */}
                          <SortableTableHead
                            currentSort={searchParams.sort}
                            onSort={handleSort}
                            label={t("Who")}
                            sortKey="Email"
                          />
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data?.sources?.map((audit) => (
                          <TableRow key={audit.auditTrailId}>
                            <TableCell>
                              <div className="flex text-nowrap">
                                {format(
                                  new Date(audit.dateUtc),
                                  "HH:mm dd MMM yyyy",
                                  {
                                    locale: formatLocale,
                                  }
                                )}
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="flex flex-col">
                                {(audit.newValues?.EnglishName ||
                                  audit.oldValues?.EnglishName) && (
                                  <div className="flex items-center gap-1 text-nowrap">
                                    <p className="font-bold">
                                      {t("English name")}:
                                    </p>
                                    <div>
                                      {audit.oldValues?.EnglishName ? (
                                        audit.oldValues?.EnglishName
                                      ) : (
                                        <NoData />
                                      )}
                                    </div>
                                    <p>-&gt;</p>
                                    <div>
                                      {audit.newValues?.EnglishName ? (
                                        audit.newValues?.EnglishName
                                      ) : (
                                        <NoData />
                                      )}
                                    </div>
                                  </div>
                                )}

                                {(audit.newValues?.VietnameseName ||
                                  audit.oldValues?.VietnameseName) && (
                                  <div className="flex items-center gap-1 text-nowrap">
                                    <p className="font-bold">
                                      {t("Vietnamese name")}:
                                    </p>
                                    <div>
                                      {audit.oldValues?.VietnameseName ? (
                                        audit.oldValues?.VietnameseName
                                      ) : (
                                        <NoData />
                                      )}
                                    </div>
                                    <p>-&gt;</p>
                                    <div>
                                      {audit.newValues?.VietnameseName ? (
                                        audit.newValues?.VietnameseName
                                      ) : (
                                        <NoData />
                                      )}
                                    </div>
                                  </div>
                                )}

                                {(audit.newValues?.RoleType ||
                                  audit.oldValues?.RoleType) && (
                                  <div className="flex items-center gap-1 text-nowrap">
                                    <p className="font-bold">{t("Type")}:</p>
                                    <div>
                                      {audit.oldValues?.RoleType ? (
                                        t(audit.oldValues?.RoleType)
                                      ) : (
                                        <NoData />
                                      )}
                                    </div>
                                    <p>-&gt;</p>
                                    <div>
                                      {audit.newValues?.RoleType ? (
                                        t(audit.newValues?.RoleType)
                                      ) : (
                                        <NoData />
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-center text-nowrap">
                                <AuditTypeBadge status={audit.trailType} />
                              </div>
                            </TableCell>
                            {/* <TableCell>
                      <div className="flex justify-center">
                        <DetailChangeDialog
                          dateUtc={audit.dateUtc}
                          trailType={audit.trailType}
                        />
                      </div>
                    </TableCell> */}
                            <TableCell>
                              <div className="flex text-nowrap">
                                {audit.email}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default HistoriesDialog
