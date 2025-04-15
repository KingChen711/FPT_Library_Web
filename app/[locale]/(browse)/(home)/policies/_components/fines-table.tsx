import React from "react"
import getFines from "@/queries/fines/get-fines"

import { getTranslations } from "@/lib/get-translations"
import { formatPrice } from "@/lib/utils"
import { searchFinesSchema } from "@/lib/validations/fines/search-fines"
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
import FineTypeBadge from "@/components/badges/fine-type-badge"

type Props = {
  searchParams: {
    search?: string
    pageIndex?: string
    pageSize?: string
    sort?: string
  }
}

const FinesTable = async ({ searchParams }: Props) => {
  const t = await getTranslations("FinesManagementPage")
  const { search, pageIndex, sort, pageSize } =
    searchFinesSchema.parse(searchParams)
  const {
    sources: fines,
    totalActualItem,
    totalPage,
  } = await getFines({ search, pageIndex, sort, pageSize })
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Fines")}</h3>
      </div>

      {fines.length === 0 ? (
        <div className="flex justify-center p-4">
          <NoResult
            title={t("Fines Not Found")}
            description={t(
              "No fines matching your request were found Please check your information or try searching with different criteria"
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
                    label={t("Title")}
                    sortKey="FinePolicyTitle"
                  />
                  <TableHead className="text-nowrap font-bold">
                    {t("Description")}
                  </TableHead>

                  <SortableTableHead
                    currentSort={sort}
                    label={t("Condition type")}
                    sortKey="ConditionType"
                    position="center"
                  />
                  <SortableTableHead
                    currentSort={sort}
                    label={t("Fixed fine amount")}
                    sortKey="FineAmountPerDay"
                  />
                  <SortableTableHead
                    currentSort={sort}
                    label={t("Fine amount per day")}
                    sortKey="FixedFineAmount"
                  />
                </TableRow>
              </TableHeader>
              <TableBody>
                {fines.map((fine) => (
                  <TableRow key={fine.finePolicyId}>
                    <TableCell>{fine.finePolicyTitle}</TableCell>
                    <TableCell>{fine.description || "-"}</TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <FineTypeBadge type={fine.conditionType} />
                      </div>
                    </TableCell>
                    <TableCell>
                      {fine.fixedFineAmount
                        ? formatPrice(fine.fixedFineAmount)
                        : "-"}
                    </TableCell>
                    <TableCell>{formatPrice(fine.fineAmountPerDay)}</TableCell>
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

export default FinesTable
