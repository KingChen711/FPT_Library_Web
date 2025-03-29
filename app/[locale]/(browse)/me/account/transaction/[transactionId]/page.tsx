import Image from "next/image"
import Link from "next/link"
import getTransactionDetail from "@/queries/transaction/get-transaction-detail"
import { format } from "date-fns"
import { ArrowLeft, Book, CreditCard, Info, User } from "lucide-react"

import { ETransactionStatus, ETransactionType } from "@/lib/types/enums"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import NoData from "@/components/ui/no-data"
import { Separator } from "@/components/ui/separator"

type Props = {
  params: {
    transactionId: number
  }
}

const formatDate = (date: string | Date | null | undefined) => {
  if (!date) return "N/A"
  const parsedDate = new Date(date)
  if (isNaN(parsedDate.getTime())) return "Invalid Date"
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate)
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

const getTransactionMethodInfo = (method: number) => {
  switch (method) {
    case 1:
      return "Online"
    case 2:
      return "Cash"
    default:
      return "Other"
  }
}

const TransactionDetailPage = async ({ params }: Props) => {
  const transaction = await getTransactionDetail({
    transactionId: params.transactionId,
  })

  if (!transaction) {
    return <NoData />
  }

  // const statusInfo = getStatusInfo(transaction.transactionStatus)
  // const transactionType = getTransactionTypeInfo(transaction.transactionType)
  const transactionMethod = getTransactionMethodInfo(
    transaction.transactionMethod
  )

  return (
    <div className="size-full">
      <div className="mb-6">
        <Link
          href="/me/account/transaction"
          className="flex items-center text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="mr-2 size-4" />
          Back to Transactions
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold">
              Transaction #{transaction.transactionCode}
            </h1>
            <p className="text-muted-foreground">
              {formatDate(transaction.transactionDate)}
            </p>
          </div>
          <Badge variant="default" className="text-nowrap capitalize">
            {transactionStatusLabels[transaction.transactionStatus] ||
              "Không xác định"}
          </Badge>
        </div>

        <Separator />

        {/* Transaction Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="size-5" />
              Transaction Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Amount</p>
                <p className="text-lg font-medium">
                  {transaction.amount.toLocaleString()} VND
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Transaction Type
                </p>
                <Badge variant="success" className="text-nowrap capitalize">
                  {transactionTypeLabels[transaction.transactionType] ||
                    "Không xác định"}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Transaction Method
                </p>
                <p className="font-medium">{transactionMethod}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">
                  {transaction.paymentMethod?.methodName || "N/A"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-medium">
                  {format(new Date(transaction.createdAt), "PPP 'at' p")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Expires At</p>
                <p className="font-medium">
                  {transaction.expiredAt
                    ? format(new Date(transaction.expiredAt), "PPP 'at' p")
                    : "N/A"}
                </p>
              </div>
              {transaction.description && (
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{transaction.description}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Information */}
        {transaction.user && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">
                    {transaction.user.firstName} {transaction.user.lastName}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{transaction.user.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">
                    {transaction.user.phone || "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Library Card ID
                  </p>
                  <p className="font-medium">
                    {transaction.user.libraryCardId}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resource Information */}
        {transaction.libraryResource && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="size-5" />
                Resource Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Title</p>
                  <p className="font-medium">
                    {transaction.libraryResource.resourceTitle}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">
                    {transaction.libraryResource.resourceType}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">
                    {(
                      transaction.libraryResource.borrowPrice ?? 0
                    ).toLocaleString()}{" "}
                    VND
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Borrow Duration
                  </p>
                  <p className="font-medium">
                    {transaction.libraryResource.defaultBorrowDurationDays} days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* QR Code */}
        {transaction.qrCode && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="size-5" />
                Payment QR Code
              </CardTitle>
              <CardDescription>
                Scan this QR code to complete your payment
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="rounded-lg bg-white p-4">
                <Image
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(transaction.qrCode)}`}
                  alt="Payment QR Code"
                  width={200}
                  height={200}
                  className="mx-auto"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" asChild>
            <Link href="/transactions">Back to Transactions</Link>
          </Button>
          {transaction.transactionStatus === ETransactionStatus.EXPIRED && (
            <Button variant="destructive">Cancel Transaction</Button>
          )}
          <Button>Download Receipt</Button>
        </div>
      </div>
    </div>
  )
}

export default TransactionDetailPage
