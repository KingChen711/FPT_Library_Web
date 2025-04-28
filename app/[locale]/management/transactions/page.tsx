import React from "react"
import { Link } from "@/i18n/routing"
import { auth } from "@/queries/auth"
import getTransactions from "@/queries/transactions/get-transactions"
import { format } from "date-fns"
import { Eye, MoreHorizontal } from "lucide-react"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { formatPrice, getFullName } from "@/lib/utils"
import { searchTransactionsSchema } from "@/lib/validations/transactions/search-transaction"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import NoData from "@/components/ui/no-data"
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
import TransactionMethodBadge from "@/components/badges/transaction-method-badge"
import TransactionStatusBadge from "@/components/badges/transaction-status-badge"
import TransactionTypeBadge from "@/components/badges/transaction-type-badge"

import FiltersTransactionsDialog from "./_components/filters-transactions-dialog"

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

async function TransactionsManagementPage({ searchParams }: Props) {
  await auth().protect(EFeature.TRANSACTION_MANAGEMENT)
  const t = await getTranslations("TransactionsManagementPage")
  const formatLocale = await getFormatLocale()

  const { search, pageIndex, sort, pageSize, ...rest } =
    searchTransactionsSchema.parse(searchParams)

  const {
    sources: transactions,
    totalActualItem,
    totalPage,
  } = await getTransactions({
    search,
    pageIndex,
    sort,
    pageSize,
    ...rest,
  })

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Transactions")}</h3>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-row items-center">
            <SearchForm
              className="h-10 rounded-r-none border-r-0"
              search={search}
            />
            <FiltersTransactionsDialog />
          </div>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="flex justify-center p-4">
          <NoResult
            title={t("Transactions Not Found")}
            description={t(
              "No transactions matching your request were found Please check your information or try searching with different criteria"
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
                    label={t("Transaction code")}
                    sortKey="TransactionCode"
                  />

                  <TableHead className="text-nowrap font-bold">
                    {t("Patron")}
                  </TableHead>

                  <SortableTableHead
                    currentSort={sort}
                    label={t("Amount")}
                    sortKey="Amount"
                    position="center"
                  />

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">{t("Status")}</div>
                  </TableHead>
                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">{t("Type")}</div>
                  </TableHead>
                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">{t("Method")}</div>
                  </TableHead>

                  <SortableTableHead
                    currentSort={sort}
                    label={t("Transaction date")}
                    sortKey="TransactionDate"
                    position="center"
                  />

                  <SortableTableHead
                    currentSort={sort}
                    label={t("Expiry at")}
                    sortKey="ExpiryAt"
                    position="center"
                  />

                  <SortableTableHead
                    currentSort={sort}
                    label={t("Cancelled at")}
                    sortKey="CancelledAt"
                    position="center"
                  />

                  <TableHead className="text-nowrap font-bold">
                    <div className="flex justify-center">{t("Actions")}</div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.transactionId}>
                    <TableCell className="text-nowrap font-bold">
                      {transaction.transactionCode}
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <Link
                        target="_blank"
                        href={`/management/library-card-holders/${transaction?.userId}`}
                        className="group flex items-center gap-2"
                      >
                        <p className="group-hover:underline">
                          {getFullName(
                            transaction.user.firstName,
                            transaction.user.lastName
                          )}
                        </p>
                      </Link>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {transaction.amount
                          ? formatPrice(transaction.amount)
                          : "-"}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        <TransactionStatusBadge
                          status={transaction.transactionStatus}
                        />
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        <TransactionTypeBadge
                          type={transaction.transactionType}
                        />
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {transaction.transactionMethod === null ||
                        transaction.transactionMethod === undefined ? (
                          "-"
                        ) : (
                          <TransactionMethodBadge
                            method={transaction.transactionMethod}
                          />
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {transaction.transactionDate
                          ? format(
                              transaction.transactionDate,
                              "HH:mm dd MMM yyyy",
                              {
                                locale: formatLocale,
                              }
                            )
                          : "-"}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {transaction.expiredAt
                          ? format(transaction.expiredAt, "HH:mm dd MMM yyyy", {
                              locale: formatLocale,
                            })
                          : "-"}
                      </div>
                    </TableCell>

                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {transaction.cancelledAt
                          ? format(
                              transaction.cancelledAt,
                              "HH:mm dd MMM yyyy",
                              {
                                locale: formatLocale,
                              }
                            )
                          : "-"}
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
                                href={`/management/transactions/${transaction.transactionId}`}
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
            {transactions.length === 0 && (
              <div className="flex justify-center p-4">
                <NoData />
              </div>
            )}
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

export default TransactionsManagementPage
