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
import {
  Column,
  searchPatronsSchema,
} from "@/lib/validations/patrons/search-patrons"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import BarcodeGenerator from "@/components/ui/barcode-generator"
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
import Hidable from "@/components/hoc/hidable"

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

  const { search, pageIndex, sort, pageSize, tab, columns, ...rest } =
    searchPatronsSchema.parse(searchParams)

  const {
    sources: patrons,
    totalActualItem,
    totalPage,
  } = await getPatrons({
    columns,
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
          <ColumnsButton columns={columns} />
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
              columns,
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

                  <Hidable hide={!columns.includes(Column.FULLNAME)}>
                    <TableHead className="text-nowrap font-bold">
                      {t("Full name")}
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.EMAIL)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Email")}
                      sortKey="Email"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.PHONE)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Phone")}
                      sortKey="Phone"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.DOB)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Dob")}
                      sortKey="Dob"
                      position="center"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.GENDER)}>
                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">{t("Gender")}</div>
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.ADDRESS)}>
                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-start">{t("Address")}</div>
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.STATUS)}>
                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">{t("Status")}</div>
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.TYPE)}>
                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">{t("Type")}</div>
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.CREATED_AT)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Create date")}
                      sortKey="CreateDate"
                      position="center"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.MODIFIED_DATE)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Modified date")}
                      sortKey="ModifiedDate"
                      position="center"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.MODIFIED_BY)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Modified by")}
                      sortKey="ModifiedBy"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.BARCODE)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Barcode")}
                      sortKey="BarCode"
                      position="center"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.FULLNAME_ON_CARD)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Name on card")}
                      sortKey="FullName"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.AVATAR)}>
                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">
                        {t("Avatar on card")}
                      </div>
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.CARD_STATUS)}>
                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">
                        {t("Card status")}
                      </div>
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.ISSUANCE_METHOD)}>
                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">
                        {t("Issuance method")}
                      </div>
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.ISSUE_DATE)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Issue date")}
                      sortKey="IssueDate"
                      position="center"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.EXPIRY_DATE)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Expiry date")}
                      sortKey="ExpiryDate"
                      position="center"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.ALLOW_BORROW_MORE)}>
                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">
                        {t("Allow borrow more")}
                      </div>
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.MAX_ITEM_ONCE_TIME)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Max item once time")}
                      sortKey="MaxItemOnceTime"
                      position="center"
                    />
                  </Hidable>

                  <Hidable
                    hide={!columns.includes(Column.ALLOW_BORROW_MORE_REASON)}
                  >
                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">
                        {t("Allow borrow more reason")}
                      </div>
                    </TableHead>
                  </Hidable>

                  <Hidable
                    hide={!columns.includes(Column.TOTAL_MISSED_PICK_UP)}
                  >
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Total missed pick up")}
                      sortKey="TotalMissedPickup"
                      position="center"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.REMINDER_SENT)}>
                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">
                        {t("Reminder sent")}
                      </div>
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.EXTENDED)}>
                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">{t("Extended")}</div>
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.EXTENSION_COUNT)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Extension count")}
                      sortKey="ExtensionCount"
                      position="center"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.SUSPENSION_END_DATE)}>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Suspension end date")}
                      sortKey="SuspensionEndDate"
                      position="center"
                    />
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.SUSPENSION_REASON)}>
                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">
                        {t("Suspension reason")}
                      </div>
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.REJECT_REASON)}>
                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">
                        {t("Reject reason")}
                      </div>
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.TRANSACTION_CODE)}>
                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">
                        {t("Transaction code")}
                      </div>
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.ARCHIVED)}>
                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">{t("Archived")}</div>
                    </TableHead>
                  </Hidable>

                  <Hidable hide={!columns.includes(Column.ARCHIVE_REASON)}>
                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">
                        {t("Archive reason")}
                      </div>
                    </TableHead>
                  </Hidable>

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

                    <Hidable hide={!columns.includes(Column.FULLNAME)}>
                      <TableCell className="text-nowrap">
                        <div className="flex items-center gap-2">
                          {getFullName(patron.firstName, patron.lastName) ||
                            "-"}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.EMAIL)}>
                      <TableCell className="text-nowrap">
                        {patron.email}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.PHONE)}>
                      <TableCell className="text-nowrap">
                        {patron.phone || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.DOB)}>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {patron.dob
                            ? format(new Date(patron.dob), "dd MMM yyyy", {
                                locale: formatLocale,
                              })
                            : "-"}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.GENDER)}>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {patron.gender ? (
                            <GenderBadge gender={patron.gender} />
                          ) : (
                            "-"
                          )}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.ADDRESS)}>
                      <TableCell className="text-nowrap">
                        {patron.address || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.STATUS)}>
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
                          <PatronHasCardBadge
                            hasCard={!!patron.libraryCardId}
                          />
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.TYPE)}>
                      <TableCell className="text-nowrap">
                        <div className="flex items-center justify-center">
                          <PatronTypeBadge
                            isEmployeeCreated={patron.isEmployeeCreated}
                          />
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.CREATED_AT)}>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {patron.createDate
                            ? format(
                                new Date(patron.createDate),
                                "dd MMM yyyy",
                                {
                                  locale: formatLocale,
                                }
                              )
                            : "-"}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.MODIFIED_DATE)}>
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
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.MODIFIED_BY)}>
                      <TableCell className="text-nowrap">
                        {patron.modifiedBy || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.BARCODE)}>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {patron.libraryCard?.barcode ? (
                            <BarcodeGenerator
                              value={patron.libraryCard.barcode}
                              options={{
                                format: "CODE128",
                                displayValue: true,
                                fontSize: 12,
                                width: 1,
                                height: 24,
                              }}
                            />
                          ) : (
                            "-"
                          )}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.FULLNAME_ON_CARD)}>
                      <TableCell className="text-nowrap">
                        {patron.libraryCard?.fullName || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.AVATAR)}>
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
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.CARD_STATUS)}>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {patron.libraryCard?.status !== undefined ? (
                            <CardStatusBadge
                              status={patron.libraryCard.status}
                            />
                          ) : (
                            "-"
                          )}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.ISSUANCE_METHOD)}>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {patron.libraryCard?.issuanceMethod !== undefined ? (
                            <IssuanceMethodBadge
                              status={patron.libraryCard.issuanceMethod}
                            />
                          ) : (
                            "-"
                          )}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.ISSUE_DATE)}>
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
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.EXPIRY_DATE)}>
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
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.ALLOW_BORROW_MORE)}>
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
                    </Hidable>

                    <Hidable
                      hide={!columns.includes(Column.MAX_ITEM_ONCE_TIME)}
                    >
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {patron.libraryCard?.maxItemOnceTime ?? "-"}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable
                      hide={!columns.includes(Column.ALLOW_BORROW_MORE_REASON)}
                    >
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
                                        patron.libraryCard
                                          ?.allowBorrowMoreReason
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
                    </Hidable>

                    <Hidable
                      hide={!columns.includes(Column.TOTAL_MISSED_PICK_UP)}
                    >
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {patron.libraryCard?.totalMissedPickUp ?? "-"}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.REMINDER_SENT)}>
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
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.EXTENDED)}>
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
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.EXTENSION_COUNT)}>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {patron.libraryCard?.extensionCount ?? "-"}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable
                      hide={!columns.includes(Column.SUSPENSION_END_DATE)}
                    >
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
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.SUSPENSION_REASON)}>
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
                                      data={
                                        patron.libraryCard?.suspensionReason
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
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.REJECT_REASON)}>
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
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.TRANSACTION_CODE)}>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {patron.libraryCard?.transactionCode || "-"}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.ARCHIVED)}>
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
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.ARCHIVE_REASON)}>
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
                    </Hidable>

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
