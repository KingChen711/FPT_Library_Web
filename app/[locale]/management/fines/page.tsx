import React from "react"
import { auth } from "@/queries/auth"
import getFines from "@/queries/fines/get-fines"

import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { formatPrice } from "@/lib/utils"
import { searchFinesSchema } from "@/lib/validations/fines/search-fines"
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
import FineTypeBadge from "@/components/badges/fine-type-badge"

import DeleteFinesButton from "./_components/delete-fines-button"
import FineActionDropdown from "./_components/fine-action-dropdown"
import FineCheckbox from "./_components/fine-checkbox"
import ImportFinesDialog from "./_components/import-fines-dialog"
import MutateFineDialog from "./_components/mutate-fine-dialog"
import SelectedIdsIndicator from "./_components/selected-ids-indicator"

type Props = {
  searchParams: {
    search?: string
    pageIndex?: string
    pageSize?: string
    sort?: string
  }
}

async function FinesManagementPage({ searchParams }: Props) {
  await auth().protect(EFeature.FINE_MANAGEMENT)

  const { search, pageIndex, sort, pageSize } =
    searchFinesSchema.parse(searchParams)
  const t = await getTranslations("FinesManagementPage")
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

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-row items-center">
            <SearchForm className="h-10" search={search} />
            {/* <FiltersFinesDialog /> */}
          </div>

          <SelectedIdsIndicator />
        </div>
        <div className="flex flex-wrap items-center gap-x-4">
          <DeleteFinesButton />
          <ImportFinesDialog />
          <MutateFineDialog type="create" />
        </div>
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
                  <TableHead></TableHead>
                  <SortableTableHead
                    currentSort={sort}
                    label={t("Title")}
                    sortKey="FinePolicyTitle"
                  />
                  <SortableTableHead
                    currentSort={sort}
                    label={t("Condition type")}
                    sortKey="ConditionType"
                    position="center"
                  />
                  <TableHead className="text-nowrap font-bold">
                    {t("Description")}
                  </TableHead>
                  <SortableTableHead
                    currentSort={sort}
                    label={t("Charge pct")}
                    sortKey="ChargePct"
                  />
                  <SortableTableHead
                    currentSort={sort}
                    label={t("Processing fee")}
                    sortKey="ProcessingFee"
                  />
                  <TableHead className="flex select-none items-center justify-center text-nowrap font-bold">
                    {t("Actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fines.map((fine) => (
                  <TableRow key={fine.finePolicyId}>
                    <TableCell className="text-nowrap">
                      <FineCheckbox id={fine.finePolicyId} />
                    </TableCell>
                    <TableCell className="text-nowrap">
                      {fine.finePolicyTitle}
                    </TableCell>
                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        <FineTypeBadge type={fine.conditionType} />
                      </div>
                    </TableCell>
                    <TableCell className="text-nowrap">
                      {fine.description}
                    </TableCell>
                    <TableCell className="text-nowrap">
                      {fine.chargePct
                        ? Math.floor(fine.chargePct * 100) + "%"
                        : "-"}
                    </TableCell>
                    <TableCell className="text-nowrap">
                      {fine.processingFee
                        ? formatPrice(fine.processingFee)
                        : "-"}
                    </TableCell>
                    <TableCell className="flex justify-center">
                      <FineActionDropdown fine={fine} />
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

export default FinesManagementPage
