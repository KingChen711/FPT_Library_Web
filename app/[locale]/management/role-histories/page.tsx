import React from "react"
import { auth } from "@/queries/auth"
import getRoleHistories from "@/queries/histories/get-role-histories"
import { format } from "date-fns"

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

async function RoleHistoriesManagementPage({ searchParams }: Props) {
  await auth().protect(EFeature.ROLE_MANAGEMENT)

  const t = await getTranslations("RoleManagement")

  const formatLocale = await getFormatLocale()
  const { pageSize, pageIndex, sort, ...rest } =
    searchAuditsSchema.parse(searchParams)

  const {
    sources: roleHistories,
    totalActualItem,
    totalPage,
  } = await getRoleHistories({
    pageSize,
    pageIndex,
    sort,
    ...rest,
  })

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Role histories")}</h3>
      </div>

      {/* <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-row items-center">
            <SearchForm
              className="h-10 rounded-r-none border-r-0"
              search={search}
            />
            <FiltersRoleHistoriesDialog />
          </div>
        </div>
      </div> */}

      {roleHistories.length === 0 ? (
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
                    currentSort={sort}
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
                    currentSort={sort}
                    label={t("Who")}
                    sortKey="Email"
                  />
                </TableRow>
              </TableHeader>
              <TableBody>
                {roleHistories?.map((audit) => (
                  <TableRow key={audit.auditTrailId}>
                    <TableCell>
                      <div className="flex text-nowrap">
                        {format(new Date(audit.dateUtc), "HH:mm dd MMM yyyy", {
                          locale: formatLocale,
                        })}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        {(audit.newValues?.EnglishName ||
                          audit.oldValues?.EnglishName) && (
                          <div className="flex items-center gap-1 text-nowrap">
                            <p className="font-bold">{t("English name")}:</p>
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
                            <p className="font-bold">{t("Vietnamese name")}:</p>
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

export default RoleHistoriesManagementPage
