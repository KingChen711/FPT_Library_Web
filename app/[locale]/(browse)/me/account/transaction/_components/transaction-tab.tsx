import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Loader2, MoreHorizontal } from "lucide-react"

import { ETransactionStatus, ETransactionType } from "@/lib/types/enums"
import { formatPrice } from "@/lib/utils"
import useGetOwnTransactions from "@/hooks/transactions/get-own-transactions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import NoData from "@/components/ui/no-data"
import Paginator from "@/components/ui/paginator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import LibraryTransactionFilter from "./library-transaction-filter"

const formatDate = (date: Date) => {
  return format(date, "dd/MM/yyyy")
}

const transactionTypeLabels: Record<ETransactionType, string> = {
  [ETransactionType.FINE]: "Phí phạt",
  [ETransactionType.DIGITAL_BORROW]: "Mượn tài liệu điện tử",
  [ETransactionType.LIBRARY_CARD_REGISTER]: "Đăng ký thẻ thư viện",
  [ETransactionType.LIBRARY_CARD_EXTENSION]: "Gia hạn thẻ thư viện",
  [ETransactionType.DIGITAL_EXTENSION]: "Gia hạn tài liệu điện tử",
}

const transactionStatusLabels: Record<ETransactionStatus, string> = {
  [ETransactionStatus.PENDING]: "Chờ xử lý",
  [ETransactionStatus.EXPIRED]: "Hết hạn",
  [ETransactionStatus.PAID]: "Đã thanh toán",
  [ETransactionStatus.CANCELLED]: "Đã hủy",
}

const TransactionTab = () => {
  const router = useRouter()
  const { data: allTransactions, isLoading } = useGetOwnTransactions()

  if (isLoading) {
    return <Loader2 className="animate-spin" />
  }

  if (!allTransactions) return <NoData />

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <CardTitle>Transaction List</CardTitle>
          <LibraryTransactionFilter />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-nowrap">Transaction Code</TableHead>
              <TableHead className="text-nowrap">Amount</TableHead>
              <TableHead className="text-nowrap">Description</TableHead>
              <TableHead className="text-nowrap">Status</TableHead>
              <TableHead className="text-nowrap">Type</TableHead>
              <TableHead className="text-nowrap">Date</TableHead>
              <TableHead className="text-nowrap">Expired at</TableHead>
              <TableHead className="text-nowrap">Created at</TableHead>
              <TableHead className="text-nowrap">Cancelled at</TableHead>
              <TableHead className="text-nowrap">Cancellation reason</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allTransactions?.sources.map((transaction) => (
              <TableRow key={transaction.transactionId}>
                <TableCell className="text-nowrap">
                  {transaction.transactionCode}
                </TableCell>
                <TableCell className="text-nowrap">
                  {formatPrice(transaction.amount)}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell className="text-nowrap">
                  <Badge variant="default" className="text-nowrap capitalize">
                    {transactionStatusLabels[transaction.transactionStatus] ||
                      "Không xác định"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="success" className="text-nowrap capitalize">
                    {transactionTypeLabels[transaction.transactionType] ||
                      "Không xác định"}
                  </Badge>
                </TableCell>
                <TableCell className="text-nowrap">
                  {transaction.transactionDate
                    ? format(transaction.transactionDate, "dd/MM/yyyy")
                    : ""}
                </TableCell>
                <TableCell className="text-nowrap">
                  {transaction.expiredAt
                    ? formatDate(transaction.expiredAt)
                    : ""}
                </TableCell>
                <TableCell className="text-nowrap">
                  {transaction.createdAt
                    ? formatDate(transaction.createdAt)
                    : ""}
                </TableCell>
                <TableCell className="text-nowrap">
                  {transaction.cancelledAt
                    ? formatDate(transaction.cancelledAt)
                    : ""}
                </TableCell>
                <TableCell className="text-nowrap">
                  {transaction.cancellationReason}
                </TableCell>

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(
                            `/me/account/transaction/${transaction.transactionId}`
                          )
                        }
                      >
                        View details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Paginator
          pageIndex={1}
          pageSize={allTransactions.pageSize}
          totalPage={allTransactions.totalPage}
          totalActualItem={allTransactions.totalActualItem}
          className="mt-4"
        />
      </CardContent>
    </Card>
  )
}

export default TransactionTab
