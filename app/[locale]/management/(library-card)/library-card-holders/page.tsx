import React from "react"
import { Link } from "@/i18n/routing"
import { auth } from "@/queries/auth"
import getPatrons from "@/queries/holders/get-holders"
import { format } from "date-fns"
import { Eye, MoreHorizontal, Plus } from "lucide-react"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature, EPatronStatus } from "@/lib/types/enums"
import { searchPatronsSchema } from "@/lib/validations/patrons/search-patrons"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import GenderBadge from "@/components/ui/gender-badge"
import Paginator from "@/components/ui/paginator"
import PatronHasCardBadge from "@/components/ui/patron-has-card-badge"
import PatronStatusBadge from "@/components/ui/patron-status-badge"
import PatronTypeBadge from "@/components/ui/patron-type-badge"
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

import ColumnsButton from "./_components/columns-button"
import ExportButton from "./_components/export-button"
import ImportButton from "./_components/import-button"
import PatronCheckbox from "./_components/patron-checkbox"
import PatronsActionsDropdown from "./_components/patrons-actions-dropdown"
import FiltersPatronsDialog from "./_components/patrons-filter-dialog"
import PatronsTabs from "./_components/patrons-tabs"
import SelectedIdsIndicator from "./_components/selected-ids-indicator"

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

async function HoldersManagementPage({ searchParams }: Props) {
  await auth().protect(EFeature.LIBRARY_ITEM_MANAGEMENT)
  const t = await getTranslations("LibraryCardManagementPage")
  const formatLocale = await getFormatLocale()

  const { search, pageIndex, sort, pageSize, tab, ...rest } =
    searchPatronsSchema.parse(searchParams)

  const {
    sources: patrons,
    totalActualItem,
    totalPage,
  } = await getPatrons({
    search,
    pageIndex,
    sort,
    pageSize,
    tab,
    ...rest,
  })

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Patrons")}</h3>
        <div className="flex items-center gap-4">
          <ColumnsButton />
          <Button asChild>
            <Link href="/management/library-card-holders/create">
              <Plus />
              {t("Create patron")}
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-row items-center">
            <SearchForm
              className="h-10 rounded-r-none border-r-0"
              search={search}
            />
            <FiltersPatronsDialog />
          </div>

          <SelectedIdsIndicator />
        </div>
        <div className="flex flex-wrap items-center gap-x-4">
          <PatronsActionsDropdown tab={tab} />
          <ImportButton />
          <ExportButton
            searchParams={{
              search,
              pageIndex,
              sort,
              pageSize,
              tab,
              ...rest,
            }}
          />
        </div>
      </div>

      <div className="mt-4 rounded-md border p-4">
        <PatronsTabs tab={tab} />
        <div className="mt-4 grid w-full">
          <div className="overflow-x-auto rounded-md">
            <Table className="overflow-hidden">
              <TableHeader>
                <TableRow>
                  <TableHead />
                  <SortableTableHead
                    currentSort={sort}
                    label={t("Email")}
                    sortKey="Email"
                  />

                  <SortableTableHead
                    currentSort={sort}
                    label={t("Full name")}
                    sortKey="FullName"
                  />

                  <SortableTableHead
                    currentSort={sort}
                    label={t("Phone")}
                    sortKey="Phone"
                  />

                  <SortableTableHead
                    currentSort={sort}
                    label={t("Dob")}
                    sortKey="Dob"
                    position="center"
                  />

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">{t("Gender")}</div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-start">{t("Address")}</div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">{t("Status")}</div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">{t("Type")}</div>
                  </TableHead>

                  <SortableTableHead
                    currentSort={sort}
                    label={t("Create date")}
                    sortKey="CreateDate"
                    position="center"
                  />

                  <SortableTableHead
                    currentSort={sort}
                    label={t("Modified date")}
                    sortKey="ModifiedDate"
                    position="center"
                  />

                  <SortableTableHead
                    currentSort={sort}
                    label={t("Modified by")}
                    sortKey="ModifiedBy"
                  />

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">{t("Actions")}</div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patrons.map((patron) => (
                  <TableRow key={patron.userId}>
                    <TableCell>
                      <PatronCheckbox id={patron.userId} />
                    </TableCell>

                    <TableCell className="text-nowrap">
                      {patron.email}
                    </TableCell>

                    <TableCell className="text-nowrap">
                      {patron.fullName || "-"}
                    </TableCell>

                    <TableCell className="text-nowrap">
                      {patron.phone || "-"}
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {patron.dob
                          ? format(new Date(patron.dob), "dd MMM yyyy", {
                              locale: formatLocale,
                            })
                          : "-"}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {patron.gender ? (
                          <GenderBadge gender={patron.gender} />
                        ) : (
                          "-"
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      {patron.address || "-"}
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <PatronStatusBadge
                          status={
                            patron.isDeleted
                              ? EPatronStatus.DELETED
                              : patron.isActive
                                ? EPatronStatus.ACTIVE
                                : EPatronStatus.INACTIVE
                          }
                        />
                        <PatronHasCardBadge hasCard={!!patron.libraryCardId} />
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex items-center justify-center">
                        <PatronTypeBadge
                          isEmployeeCreated={patron.isEmployeeCreated}
                        />
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {patron.createDate
                          ? format(new Date(patron.createDate), "dd MMM yyyy", {
                              locale: formatLocale,
                            })
                          : "-"}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {patron.modifiedDate
                          ? format(
                              new Date(patron.modifiedDate),
                              "dd MMM yyyy",
                              {
                                locale: formatLocale,
                              }
                            )
                          : "-"}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      {patron.modifiedBy || "-"}
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
                                href={`/management/library-card-holders/${patron.userId}`}
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
          </div>
        </div>
      </div>
      <Paginator
        pageSize={+pageSize}
        pageIndex={pageIndex}
        totalPage={totalPage}
        totalActualItem={totalActualItem}
        className="mt-6"
      />
    </div>
  )
}

export default HoldersManagementPage
