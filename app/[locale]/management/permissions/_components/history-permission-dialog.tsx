/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react"
import { format } from "date-fns"
import { useTranslations } from "next-intl"

import { type TSearchAuditsSchema } from "@/lib/validations/audits/search-audits"
import useAudits from "@/hooks/audits/use-audits"
import useFormatLocale from "@/hooks/utils/use-format-locale"
import AuditTypeBadge from "@/components/ui/audit-type-badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
  rolePermissionId: number
}

const initSearchParams: TSearchAuditsSchema = {
  entityId: 0, //assign inside main component
  entityName: "RolePermission",
  pageIndex: 1,
  pageSize: "5",
  search: "",
  sort: "-DateUtc",
}

function PermissionHistoryDialog({ setOpen, open, rolePermissionId }: Props) {
  //   const locale = useLocale()
  const formatLocale = useFormatLocale()

  const t = useTranslations("RoleManagement")

  const [searchParams, setSearchParams] = useState({
    ...initSearchParams,
    entityId: rolePermissionId,
  })

  const { data, isPending } = useAudits(searchParams)

  //   const [pending, startTransition] = useTransition()

  //   const handleDeleteRole = () => {
  //     startTransition(async () => {
  //       const res = await deleteRole(rolePermissionId)

  //       if (res.isSuccess) {
  //         toast({
  //           title: locale === "vi" ? "Thành công" : "Success",
  //           description: res.data,
  //           variant: "success",
  //         })
  //         setOpen(false)
  //         return
  //       }

  //       handleServerActionError(res, locale)
  //     })
  //   }

  const handleSort = (sortKey: any) =>
    setSearchParams((prev) => ({
      ...prev,
      sort: sortKey,
      pageIndex: 1,
    }))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[80vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="mb-1">{t("Changes history")}</DialogTitle>
          <DialogDescription asChild>
            <div>
              <div className="grid w-full">
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
                      {!isPending &&
                        (!data?.sources || data.sources.length === 0) && (
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
                            <div className="flex text-nowrap">
                              {audit.email}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center text-nowrap">
                              <AuditTypeBadge status={audit.trailType} />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-center">
                              {/* <DetailChangeDialog
                                  dateUtc={audit.dateUtc}
                                  trailType={audit.trailType}
                                /> */}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              {data && data.sources.length > 0 && (
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
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default PermissionHistoryDialog
