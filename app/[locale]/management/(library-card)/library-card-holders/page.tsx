import React from "react"
import { Link } from "@/i18n/routing"
import { auth } from "@/queries/auth"
import getPatrons from "@/queries/patrons/get-patrons"
import { format } from "date-fns"
import { Check, Eye, MoreHorizontal, Plus, X } from "lucide-react"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature, EPatronStatus } from "@/lib/types/enums"
import { getFullName } from "@/lib/utils"
import { searchPatronsSchema } from "@/lib/validations/patrons/search-patrons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Paginator from "@/components/ui/paginator"
import ParseHtml from "@/components/ui/parse-html"
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
import CardStatusBadge from "@/components/badges/card-status-badge"
import GenderBadge from "@/components/badges/gender-badge"
import IssuanceMethodBadge from "@/components/badges/issuance-method-badge"
import PatronHasCardBadge from "@/components/badges/patron-has-card-badge"
import PatronStatusBadge from "@/components/badges/patron-status-badge"
import PatronTypeBadge from "@/components/badges/patron-type-badge"

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

  console.log({ searchParams })

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

                  <TableHead className="text-nowrap font-bold">
                    {t("Full name")}
                  </TableHead>

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

                  <SortableTableHead
                    currentSort={sort}
                    label={t("Name on card")}
                    sortKey="FullName"
                  />

                  <SortableTableHead
                    currentSort={sort}
                    label={t("Avatar on card")}
                    sortKey="FullName"
                  />

                  <SortableTableHead
                    currentSort={sort}
                    label={t("Barcode")}
                    sortKey="BarCode"
                    position="center"
                  />

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Transaction code")}
                    </div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Issuance method")}
                    </div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Card status")}
                    </div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Allow borrow more")}
                    </div>
                  </TableHead>

                  <SortableTableHead
                    currentSort={sort}
                    label={t("Max item once time")}
                    sortKey="MaxItemOnceTime"
                    position="center"
                  />

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Allow borrow more reason")}
                    </div>
                  </TableHead>

                  <SortableTableHead
                    currentSort={sort}
                    label={t("Total missed pick up")}
                    sortKey="TotalMissedPickup"
                    position="center"
                  />

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Reminder sent")}
                    </div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">{t("Extended")}</div>
                  </TableHead>

                  <SortableTableHead
                    currentSort={sort}
                    label={t("Extension count")}
                    sortKey="ExtensionCount"
                    position="center"
                  />

                  <SortableTableHead
                    currentSort={sort}
                    label={t("Issue date")}
                    sortKey="IssueDate"
                    position="center"
                  />

                  <SortableTableHead
                    currentSort={sort}
                    label={t("Expiry date")}
                    sortKey="ExpiryDate"
                    position="center"
                  />

                  <SortableTableHead
                    currentSort={sort}
                    label={t("Suspension end date")}
                    sortKey="SuspensionEndDate"
                    position="center"
                  />

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Suspension reason")}
                    </div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Reject reason")}
                    </div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">{t("Archived")}</div>
                  </TableHead>

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">
                      {t("Archive reason")}
                    </div>
                  </TableHead>

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
                      <div className="flex items-center gap-2">
                        <Avatar className="size-8">
                          <AvatarImage src={patron.avatar || ""} />
                          <AvatarFallback>
                            {getFullName(patron.firstName, patron.lastName)
                              .split(" ")
                              .map((i) => i[0].toUpperCase())
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {patron.email}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      {getFullName(patron.firstName, patron.lastName) || "-"}
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

                    <TableCell className="text-nowrap">
                      {patron.libraryCard?.fullName || "-"}
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {patron.libraryCard ? (
                          <Avatar>
                            <AvatarImage
                              src={patron.libraryCard.avatar || ""}
                            />
                            <AvatarFallback>
                              {patron.libraryCard.fullName
                                .split(" ")
                                .map((i) => i[0].toUpperCase())
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          "-"
                        )}
                      </div>
                    </TableCell>

                    <TableCell></TableCell>
                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {patron.libraryCard?.transactionCode || "-"}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {patron.libraryCard?.issuanceMethod ? (
                          <IssuanceMethodBadge
                            status={patron.libraryCard.issuanceMethod}
                          />
                        ) : (
                          "-"
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {patron.libraryCard?.status ? (
                          <CardStatusBadge status={patron.libraryCard.status} />
                        ) : (
                          "-"
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {patron.libraryCard ? (
                          patron.libraryCard.isAllowBorrowMore ? (
                            <Check className="text-success" />
                          ) : (
                            <X className="text-danger" />
                          )
                        ) : (
                          "-"
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {patron.libraryCard?.maxItemOnceTime ?? "-"}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {patron.libraryCard?.allowBorrowMoreReason ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="secondary">
                                {t("View content")}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[80vh] w-full max-w-2xl overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>{t("Description")}</DialogTitle>
                                <DialogDescription>
                                  <ParseHtml
                                    data={
                                      patron.libraryCard?.allowBorrowMoreReason
                                    }
                                  />
                                </DialogDescription>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          "-"
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {patron.libraryCard?.totalMissedPickUp ?? "-"}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {patron.libraryCard ? (
                          patron.libraryCard.isReminderSent ? (
                            <Check className="text-success" />
                          ) : (
                            <X className="text-danger" />
                          )
                        ) : (
                          "-"
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {patron.libraryCard ? (
                          patron.libraryCard.isExtended ? (
                            <Check className="text-success" />
                          ) : (
                            <X className="text-danger" />
                          )
                        ) : (
                          "-"
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {patron.libraryCard?.extensionCount ?? "-"}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {patron.libraryCard?.issueDate
                          ? format(
                              new Date(patron.libraryCard?.issueDate),
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
                        {patron.libraryCard?.expiryDate
                          ? format(
                              new Date(patron.libraryCard?.expiryDate),
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
                        {patron.libraryCard?.suspensionEndDate
                          ? format(
                              new Date(patron.libraryCard?.suspensionEndDate),
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
                        {patron.libraryCard?.suspensionReason ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="secondary">
                                {t("View content")}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[80vh] w-full max-w-2xl overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>{t("Description")}</DialogTitle>
                                <DialogDescription>
                                  <ParseHtml
                                    data={patron.libraryCard?.suspensionReason}
                                  />
                                </DialogDescription>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          "-"
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {patron.libraryCard?.rejectReason ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="secondary">
                                {t("View content")}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[80vh] w-full max-w-2xl overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>{t("Description")}</DialogTitle>
                                <DialogDescription>
                                  <ParseHtml
                                    data={patron.libraryCard?.rejectReason}
                                  />
                                </DialogDescription>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          "-"
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {patron.libraryCard ? (
                          patron.libraryCard.isArchived ? (
                            <Check className="text-success" />
                          ) : (
                            <X className="text-danger" />
                          )
                        ) : (
                          "-"
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {patron.libraryCard?.archiveReason ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="secondary">
                                {t("View content")}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[80vh] w-full max-w-2xl overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>{t("Description")}</DialogTitle>
                                <DialogDescription>
                                  <ParseHtml
                                    data={patron.libraryCard?.archiveReason}
                                  />
                                </DialogDescription>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                        ) : (
                          "-"
                        )}
                      </div>
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
