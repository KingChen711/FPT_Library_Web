import React from "react"
import { auth } from "@/queries/auth"
import getPermissionHistories from "@/queries/histories/get-permission-histories"
import { format } from "date-fns"
import { getLocale } from "next-intl/server"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { searchAuditsSchema } from "@/lib/validations/audits/search-audits"
import AuditTypeBadge from "@/components/ui/audit-type-badge"
import NoData from "@/components/ui/no-data"
import NoResult from "@/components/ui/no-result"
import Paginator from "@/components/ui/paginator"
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
  searchParams: Record<string, string | string[] | undefined>
}

async function PermissionHistoriesManagementPage({ searchParams }: Props) {
  await auth().protect(EFeature.ROLE_MANAGEMENT)

  const t = await getTranslations("RoleManagement")

  const locale = await getLocale()
  const formatLocale = await getFormatLocale()
  const { pageSize, pageIndex, sort, ...rest } =
    searchAuditsSchema.parse(searchParams)

  const {
    sources: permissionHistories,
    totalActualItem,
    totalPage,
  } = await getPermissionHistories({
    pageSize,
    pageIndex,
    sort,
    ...rest,
  })

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Permission histories")}</h3>
      </div>

      {/* <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-row items-center">
            <SearchForm
              className="h-10 rounded-r-none border-r-0"
              search={search}
            />
            <FiltersPermissionHistoriesDialog />
          </div>
        </div>
      </div> */}

      {permissionHistories.length === 0 ? (
        <div className="flex justify-center p-4">
          <NoResult
            title={t("Permission histories Not Found")}
            description={t(
              "No permission histories matching your request were found Please check your information or try searching with different criteria"
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
                    currentSort={sort}
                    label={t("When")}
                    sortKey="DateUtc"
                  />

                  <TableHead>
                    <div className="flex text-nowrap font-bold">
                      {t("Change permission header")}
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
                    currentSort={sort}
                    label={t("Who")}
                    sortKey="Email"
                  />
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissionHistories?.map((audit) => (
                  <TableRow key={audit.auditTrailId}>
                    <TableCell>
                      <div className="flex text-nowrap">
                        {format(new Date(audit.dateUtc), "HH:mm dd MMM yyyy", {
                          locale: formatLocale,
                        })}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1 text-nowrap">
                        <p>
                          {"["}
                          {audit.role
                            ? locale === "vi"
                              ? audit.role.vietnameseName
                              : audit.role.englishName
                            : "?"}
                        </p>
                        <p>-</p>
                        <p>
                          {audit.feature
                            ? locale === "vi"
                              ? audit.feature.vietnameseName
                              : audit.feature.englishName
                            : "?"}
                          {"]:"}
                        </p>

                        <div>
                          {audit.oldValues?.Permission ? (
                            locale === "vi" ? (
                              audit.oldValues?.Permission.vietnameseName
                            ) : (
                              audit.oldValues?.Permission.englishName
                            )
                          ) : (
                            <NoData />
                          )}
                        </div>
                        <p>-&gt;</p>
                        <div>
                          {audit.newValues?.Permission ? (
                            locale === "vi" ? (
                              audit.newValues?.Permission.vietnameseName
                            ) : (
                              audit.newValues?.Permission.englishName
                            )
                          ) : (
                            <NoData />
                          )}
                        </div>
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
                      <div className="flex text-nowrap">{audit.email}</div>
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

export default PermissionHistoriesManagementPage
