import React from "react"
import { Link } from "@/i18n/routing"
import { auth } from "@/queries/auth"
import getCards from "@/queries/patrons/cards/get-cards"
import { format } from "date-fns"
import { Check, Eye, MoreHorizontal, Plus, X } from "lucide-react"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import {
  Column,
  searchCardsSchema,
} from "@/lib/validations/patrons/cards/search-cards"
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
import IssuanceMethodBadge from "@/components/badges/issuance-method-badge"
import Hidable from "@/components/hoc/hidable"

import CardsTabs from "./_components/cards-tabs"
import ColumnsButton from "./_components/columns-button"
import FiltersCardsDialog from "./_components/filters-cards-dialog"

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

async function CardsManagementPage({ searchParams }: Props) {
  await auth().protect(EFeature.LIBRARY_ITEM_MANAGEMENT)
  const t = await getTranslations("LibraryCardManagementPage")
  const formatLocale = await getFormatLocale()

  const { search, pageIndex, sort, pageSize, tab, columns, ...rest } =
    searchCardsSchema.parse(searchParams)

  const {
    sources: cards,
    totalActualItem,
    totalPage,
  } = await getCards({
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
        <h3 className="text-2xl font-semibold">{t("Cards")}</h3>
        <div className="flex items-center gap-4"></div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-row items-center">
            <SearchForm
              className="h-10 rounded-r-none border-r-0"
              search={search}
            />
            <FiltersCardsDialog />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-4">
          <ColumnsButton columns={columns} />
          <Button asChild>
            <Link href="/management/library-card-holders/create">
              <Plus />
              {t("Create card")}
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-4 rounded-md border p-4">
        <CardsTabs tab={tab} />
        <div className="mt-4 grid w-full">
          <div className="overflow-x-auto rounded-md">
            <Table className="overflow-hidden">
              <TableHeader>
                <TableRow>
                  <TableHead />

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
                {cards.map((card) => (
                  <TableRow key={card.libraryCardId}>
                    <TableCell>
                      {/* <CardCheckbox id={card.userId} /> */}
                    </TableCell>

                    <Hidable hide={!columns.includes(Column.BARCODE)}>
                      <TableCell></TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.FULLNAME_ON_CARD)}>
                      <TableCell className="text-nowrap">
                        {card?.fullName || "-"}
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.AVATAR)}>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {card ? (
                            <Avatar>
                              <AvatarImage src={card.avatar || ""} />
                              <AvatarFallback>
                                {card.fullName
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
                          {card?.status !== undefined ? (
                            <CardStatusBadge status={card.status} />
                          ) : (
                            "-"
                          )}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.ISSUANCE_METHOD)}>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {card?.issuanceMethod !== undefined ? (
                            <IssuanceMethodBadge status={card.issuanceMethod} />
                          ) : (
                            "-"
                          )}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.ISSUE_DATE)}>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {card?.issueDate
                            ? format(new Date(card?.issueDate), "dd MMM yyyy", {
                                locale: formatLocale,
                              })
                            : "-"}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.EXPIRY_DATE)}>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {card?.expiryDate
                            ? format(
                                new Date(card?.expiryDate),
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
                          {card ? (
                            card.isAllowBorrowMore ? (
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
                          {card?.maxItemOnceTime ?? "-"}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable
                      hide={!columns.includes(Column.ALLOW_BORROW_MORE_REASON)}
                    >
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {card?.allowBorrowMoreReason ? (
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
                                      data={card?.allowBorrowMoreReason}
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
                          {card?.totalMissedPickUp ?? "-"}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.REMINDER_SENT)}>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {card ? (
                            card.isReminderSent ? (
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
                          {card ? (
                            card.isExtended ? (
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
                          {card?.extensionCount ?? "-"}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable
                      hide={!columns.includes(Column.SUSPENSION_END_DATE)}
                    >
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {card?.suspensionEndDate
                            ? format(
                                new Date(card?.suspensionEndDate),
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
                          {card?.suspensionReason ? (
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
                                    <ParseHtml data={card?.suspensionReason} />
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
                          {card?.rejectReason ? (
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
                                    <ParseHtml data={card?.rejectReason} />
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
                          {card?.transactionCode || "-"}
                        </div>
                      </TableCell>
                    </Hidable>

                    <Hidable hide={!columns.includes(Column.ARCHIVED)}>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          {card ? (
                            card.isArchived ? (
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
                          {card?.archiveReason ? (
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
                                    <ParseHtml data={card?.archiveReason} />
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
                                href={`/management/library-cards/${card.libraryCardId}`}
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

export default CardsManagementPage
