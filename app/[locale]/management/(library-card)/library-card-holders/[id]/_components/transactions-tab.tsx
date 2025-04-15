"use client"

import React, { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Eye, Loader2, MoreHorizontal } from "lucide-react"
import { useTranslations } from "next-intl"

import { formatPrice } from "@/lib/utils"
import usePatronTransactions from "@/hooks/patrons/use-patron-transactions"
import useFormatLocale from "@/hooks/utils/use-format-locale"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TabsContent } from "@/components/ui/tabs"
import TransactionMethodBadge from "@/components/badges/transaction-method-badge"
import TransactionStatusBadge from "@/components/badges/transaction-status-badge"
import TransactionTypeBadge from "@/components/badges/transaction-type-badge"

type Props = {
  userId: string
}

function TransactionsTab({ userId }: Props) {
  const t = useTranslations("LibraryCardManagementPage")
  const formatLocale = useFormatLocale()

  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState<"5" | "10" | "30" | "50" | "100">(
    "5"
  )

  const { data, isLoading } = usePatronTransactions(userId, {
    pageIndex,
    pageSize,
  })

  const handlePaginate = (selectedPage: number) => {
    setPageIndex(selectedPage)
  }

  const handleChangePageSize = (size: "5" | "10" | "30" | "50" | "100") => {
    setPageSize(size)
  }

  if (isLoading) {
    return (
      <TabsContent value="transactions">
        <div className="w-full justify-center">
          <Loader2 className="size-9 animate-spin" />
        </div>
      </TabsContent>
    )
  }

  return (
    <TabsContent value="transactions">
      <div className="grid w-full">
        <div className="overflow-x-auto rounded-md border">
          <Table className="overflow-hidden">
            <TableHeader>
              <TableRow>
                <TableHead className="text-nowrap font-bold">
                  {t("Transaction code")}
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  {t("Amount")}
                </TableHead>
                <TableHead>
                  <div className="flex justify-center text-nowrap font-bold">
                    {t("Status")}
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex justify-center text-nowrap font-bold">
                    {t("Type")}
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex justify-center text-nowrap font-bold">
                    {t("Method")}
                  </div>
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">{t("Description")}</div>
                </TableHead>
                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center text-nowrap font-bold">
                    {t("Transaction date")}
                  </div>
                </TableHead>

                <TableHead>
                  <div className="flex justify-center text-nowrap font-bold">
                    {t("Expired at")}
                  </div>
                </TableHead>

                <TableHead>
                  <div className="flex justify-center text-nowrap font-bold">
                    {t("Created at")}
                  </div>
                </TableHead>

                <TableHead>
                  <div className="flex text-nowrap font-bold">
                    {t("Created by")}
                  </div>
                </TableHead>

                <TableHead>
                  <div className="flex justify-center text-nowrap font-bold">
                    {t("Cancelled at")}
                  </div>
                </TableHead>

                <TableHead className="text-nowrap font-bold">
                  <div className="flex justify-center">
                    {t("Cancellation reason")}
                  </div>
                </TableHead>
                <TableHead>{t("Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!isLoading &&
                data?.sources.map((transaction) => (
                  <TableRow key={transaction.transactionId}>
                    <TableCell className="text-nowrap font-bold">
                      {transaction.transactionCode}
                    </TableCell>
                    <TableCell className="text-nowrap">
                      {transaction.amount
                        ? formatPrice(transaction.amount)
                        : "-"}
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
                        <TransactionMethodBadge
                          method={transaction.transactionMethod}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {transaction.description ? (
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
                                  <ParseHtml data={transaction.description} />
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
                        {transaction.transactionDate
                          ? format(
                              new Date(transaction.transactionDate),
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
                        {transaction.expiredAt
                          ? format(
                              new Date(transaction.expiredAt),
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
                        {transaction.createdAt
                          ? format(
                              new Date(transaction.createdAt),
                              "dd MMM yyyy",
                              {
                                locale: formatLocale,
                              }
                            )
                          : "-"}
                      </div>
                    </TableCell>
                    <TableCell>{transaction.createdBy || "-"}</TableCell>
                    <TableCell className="text-nowrap">
                      <div className="flex justify-center">
                        {transaction.cancelledAt
                          ? format(
                              new Date(transaction.cancelledAt),
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
                        {transaction.cancellationReason ? (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="secondary">
                                {t("View content")}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[80vh] w-full max-w-2xl overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>
                                  {t("Cancelled reason")}
                                </DialogTitle>
                                <DialogDescription>
                                  <ParseHtml
                                    data={transaction.cancellationReason}
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
                                target="_blank"
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
        </div>

        {data && (
          <Paginator
            pageSize={+pageSize}
            pageIndex={pageIndex}
            totalPage={data.totalPage}
            totalActualItem={data.totalActualItem}
            className="mt-6"
            onPaginate={handlePaginate}
            onChangePageSize={handleChangePageSize}
          />
        )}
      </div>
    </TabsContent>
  )
}

export default TransactionsTab
