import Link from "next/link"
import getTransactionsPatron from "@/queries/transaction/get-transactions-patron"
import { format } from "date-fns"
import { Eye, MoreHorizontal } from "lucide-react"

import { getTranslations } from "@/lib/get-translations"
import { formatPrice } from "@/lib/utils"
import { searchTransactionSchema } from "@/lib/validations/transactions/search-transactions"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import NoResult from "@/components/ui/no-result"
import Paginator from "@/components/ui/paginator"
import ParamSearchForm from "@/components/ui/param-search-form"
import SortableTableHead from "@/components/ui/sortable-table-head"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import TransactionStatusBadge from "@/components/badges/transaction-status-badge"
import TransactionTypeBadge from "@/components/badges/transaction-type-badge"

import FilterTransactionDialog from "./_components/filter-transaction-dialog"

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

const formatDate = (date: Date) => {
  return format(date, "dd/MM/yyyy")
}

const TransactionPage = async ({ searchParams }: Props) => {
  const t = await getTranslations("TransactionPage")
  const { searchTransaction, pageIndex, sort, pageSize, ...rest } =
    searchTransactionSchema.parse(searchParams)

  const {
    sources: transactions,
    totalActualItem,
    totalPage,
  } = await getTransactionsPatron({
    searchTransaction,
    pageIndex,
    sort,
    pageSize,
    ...rest,
  })

  return (
    <div className="flex h-full flex-col gap-2">
      <h1 className="text-2xl font-bold">{t("transaction")}</h1>
      <p className="text-muted-foreground">{t("transaction desc")}</p>

      <div className="space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <div className="flex flex-row items-center">
            <ParamSearchForm
              searchKey="searchTransaction"
              className="h-full rounded-r-none border-r-0"
              search={searchTransaction}
            />
            <FilterTransactionDialog />
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
                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">
                        {t("ordinal number")}
                      </div>
                    </TableHead>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("transactionCode")}
                      sortKey="TransactionCode"
                      position="center"
                    />
                    <SortableTableHead
                      currentSort={sort}
                      label={t("amount")}
                      sortKey="Amount"
                      position="center"
                    />
                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">
                        {t("description")}
                      </div>
                    </TableHead>
                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">
                        {t("transactionStatus")}
                      </div>
                    </TableHead>
                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">
                        {t("transactionType")}
                      </div>
                    </TableHead>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("transactionDate")}
                      sortKey="TransactionDate"
                      position="center"
                    />
                    <SortableTableHead
                      currentSort={sort}
                      label={t("expiredAt")}
                      sortKey="ExpiredAt"
                      position="center"
                    />
                    <SortableTableHead
                      currentSort={sort}
                      label={t("createdAt")}
                      sortKey="CreatedAt"
                      position="center"
                    />
                    <SortableTableHead
                      currentSort={sort}
                      label={t("cancelledAt")}
                      sortKey="CancelledAt"
                      position="center"
                    />
                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">
                        {t("cancellationReason")}
                      </div>
                    </TableHead>
                    <TableHead className="text-nowrap font-bold">
                      <div className="flex justify-center">{t("actions")}</div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction, index) => (
                    <TableRow key={transaction.transactionId}>
                      <TableCell className="text-nowrap">{index + 1}</TableCell>
                      <TableCell className="text-nowrap">
                        {transaction.transactionCode}
                      </TableCell>
                      <TableCell className="text-nowrap">
                        {formatPrice(transaction.amount)}
                      </TableCell>
                      <TableCell>{transaction.description || "_"}</TableCell>
                      <TableCell className="text-nowrap">
                        <TransactionStatusBadge
                          status={transaction.transactionStatus}
                        />
                      </TableCell>
                      <TableCell>
                        <TransactionTypeBadge
                          type={transaction.transactionType}
                        />
                      </TableCell>
                      <TableCell className="text-nowrap">
                        {transaction.transactionDate
                          ? format(transaction.transactionDate, "dd/MM/yyyy")
                          : "_"}
                      </TableCell>
                      <TableCell className="text-nowrap">
                        {transaction.expiredAt
                          ? formatDate(transaction.expiredAt)
                          : "_"}
                      </TableCell>
                      <TableCell className="text-nowrap">
                        {transaction.createdAt
                          ? formatDate(transaction.createdAt)
                          : "_"}
                      </TableCell>
                      <TableCell className="text-nowrap">
                        {transaction.cancelledAt
                          ? formatDate(transaction.cancelledAt)
                          : "_"}
                      </TableCell>
                      <TableCell className="text-nowrap">
                        {transaction.cancellationReason || "_"}
                      </TableCell>

                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/me/account/transaction/${transaction.transactionId}`}
                              >
                                <Eye className="mr-2 size-4" /> {t("detail")}
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
    </div>
  )
}

export default TransactionPage
