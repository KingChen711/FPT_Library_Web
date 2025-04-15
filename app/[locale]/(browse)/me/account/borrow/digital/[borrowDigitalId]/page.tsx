"use client"

import Link from "next/link"
import { format } from "date-fns"
import { ArrowLeft, Calendar, Clock, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { ETransactionStatus, ETransactionType } from "@/lib/types/enums"
import type { DigitalTransaction } from "@/lib/types/models"
import { formatPrice } from "@/lib/utils"
import useBorrowDigitalDetail from "@/hooks/library-items/use-borrow-digital-detail"
import { Badge } from "@/components/ui/badge"
import BorrowDigitalStatusBadge from "@/components/ui/borrow-digital-status-badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import NoData from "@/components/ui/no-data"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Props = {
  params: {
    borrowDigitalId: number
  }
}

const formatDate = (dateString: string): string => {
  return format(new Date(dateString), "dd/MM/yyyy")
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

const calculateProgress = (startDate: string, endDate: string): number => {
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  const now = new Date().getTime()

  if (now >= end) return 100
  if (now <= start) return 0

  const total = end - start
  const elapsed = now - start
  return Math.round((elapsed / total) * 100)
}

const BorrowDigitalDetail = ({ params }: Props) => {
  const t = useTranslations("BookPage.borrow tracking")

  const { data: digitalBorrow, isLoading } = useBorrowDigitalDetail(
    params.borrowDigitalId
  )

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-12 animate-spin text-primary" />
          <Skeleton className="h-2 w-full text-sm text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (!digitalBorrow) {
    return <NoData />
  }

  const progress = calculateProgress(
    digitalBorrow.registerDate,
    digitalBorrow.expiryDate
  )

  return (
    <div className="mx-auto">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/me/account/borrow">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{t("digital borrow detail")}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Resource Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t("resource information")}</CardTitle>
            <CardDescription>
              {t("details about the borrowed digital resource")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold">
                {digitalBorrow.libraryResource.resourceTitle}
              </h3>
              <div className="flex items-center gap-2">
                <BorrowDigitalStatusBadge status={digitalBorrow.status} />
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {t("resource price")}
                </p>
                <p className="font-medium">
                  {formatPrice(digitalBorrow.libraryResource.borrowPrice!)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {t("extension count")}
                </p>
                <p className="font-medium">{digitalBorrow.extensionCount}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {t("extended")}
                </p>
                <p className="font-medium">
                  {digitalBorrow.isExtended ? (
                    <Icons.Check color="green" />
                  ) : (
                    <Icons.X color="red" />
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Borrow Period */}
        <Card>
          <CardHeader>
            <CardTitle>{t("borrow period")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("progress")}
                  </p>
                  <p className="text-sm font-medium">{progress}%</p>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="rounded-md border p-3">
                <div className="mb-3 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{t("register date")}</p>
                  </div>
                  <p className="pl-6 text-sm">
                    {formatDate(digitalBorrow.registerDate)}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-4 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      {t("expiration date")}
                    </p>
                  </div>
                  <p className="pl-6 text-sm">
                    {formatDate(digitalBorrow.expiryDate)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction List */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t("transaction history")}</CardTitle>
          <CardDescription>
            {t("all transactions related to this digital borrow")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("ordinal number")}</TableHead>
                  <TableHead>{t("transaction code")}</TableHead>
                  <TableHead>{t("amount")}</TableHead>
                  <TableHead>{t("type")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead>{t("transaction date")}</TableHead>
                  <TableHead>{t("expiration date")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {digitalBorrow.transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      {t("not found transaction")}
                    </TableCell>
                  </TableRow>
                ) : (
                  digitalBorrow.transactions.map(
                    (transaction: DigitalTransaction, index) => (
                      <TableRow key={transaction.transactionId}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {transaction.transactionCode}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatPrice(transaction.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="success">
                            {transactionTypeLabels[
                              transaction.transactionType
                            ] || "Không xác định"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default" className="capitalize">
                            {transactionStatusLabels[
                              transaction.transactionStatus
                            ] || "Không xác định"}
                          </Badge>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-1 size-3 text-muted-foreground" />
                            {transaction.transactionDate ? (
                              <span>
                                {formatDate(
                                  transaction.transactionDate.toString()
                                )}
                              </span>
                            ) : (
                              <NoData />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="mr-1 size-3 text-muted-foreground" />
                            {transaction.expiredAt ? (
                              <span>
                                {formatDate(transaction.expiredAt.toString())}
                              </span>
                            ) : (
                              <NoData />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Additional Details (Collapsible) */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t("additional information")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {t("created at")}
              </p>
              <div className="flex items-center">
                <Calendar className="mr-1 size-3 text-muted-foreground" />

                {digitalBorrow.transactions[0]?.createdAt ? (
                  <p>
                    {formatDate(
                      digitalBorrow.transactions[0].createdAt.toString()
                    )}
                  </p>
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {t("cancelled at")}
              </p>
              <div className="flex items-center">
                <Calendar className="mr-1 size-3 text-muted-foreground" />
                {digitalBorrow.transactions[0]?.cancelledAt ? (
                  <p>
                    {formatDate(
                      digitalBorrow.transactions[0].cancelledAt.toString()
                    )}
                  </p>
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                {t("description")}
              </p>
              {digitalBorrow.transactions[0]?.description || <NoData />}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BorrowDigitalDetail
