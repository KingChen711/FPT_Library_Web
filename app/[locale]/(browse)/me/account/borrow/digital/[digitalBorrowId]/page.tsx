"use client"

import { Link } from "@/i18n/routing"
import { format } from "date-fns"
import { ArrowLeft, Calendar, Clock, Loader2 } from "lucide-react"

import type { DigitalTransaction } from "@/lib/types/models"
import { formatPrice } from "@/lib/utils"
import useDigitalBorrowDetail from "@/hooks/library-items/use-digital-borrow-detail"
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
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
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
    digitalBorrowId: number
  }
}

const formatDate = (dateString: string): string => {
  return format(new Date(dateString), "MMM dd, yyyy")
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

const DigitalBorrowDetail = ({ params }: Props) => {
  const { data: digitalBorrow, isLoading } = useDigitalBorrowDetail(
    params.digitalBorrowId
  )

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-12 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Loading borrow details...
          </p>
        </div>
      </div>
    )
  }

  if (!digitalBorrow) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Resource Not Found</CardTitle>
            <CardDescription>
              The digital borrow information you are looking for could not be
              found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/me/account/borrow">
                <ArrowLeft className="mr-2 size-4" />
                Back to Digital Borrows
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const progress = calculateProgress(
    digitalBorrow.registerDate,
    digitalBorrow.expiryDate
  )

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/me/account/borrow">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Digital Borrow Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Resource Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Resource Information</CardTitle>
            <CardDescription>
              Details about the borrowed digital resource
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold">
                {digitalBorrow.libraryResource.resourceTitle}
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="info" className="px-2 py-0">
                  ID: {params.digitalBorrowId}
                </Badge>
                <BorrowDigitalStatusBadge status={digitalBorrow.status} />
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Resource Price
                </p>
                <p className="font-medium">
                  {formatPrice(digitalBorrow.libraryResource.borrowPrice!)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Extension Count
                </p>
                <p className="font-medium">{digitalBorrow.extensionCount}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Extended
                </p>
                <p className="font-medium">
                  {digitalBorrow.isExtended ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Borrow Period */}
        <Card>
          <CardHeader>
            <CardTitle>Borrow Period</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Progress
                  </p>
                  <p className="text-sm font-medium">{progress}%</p>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="rounded-lg border p-3">
                <div className="mb-3 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Register Date</p>
                  </div>
                  <p className="pl-6 text-sm">
                    {formatDate(digitalBorrow.registerDate)}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-4 text-muted-foreground" />
                    <p className="text-sm font-medium">Expiration Date</p>
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
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            All transactions related to this digital borrow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Transaction Code</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transaction Date</TableHead>
                  <TableHead>Expiry Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {digitalBorrow.transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No transactions found
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
                            {transaction.transactionType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={"default"} className="capitalize">
                            {transaction.transactionStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-1 size-3 text-muted-foreground" />
                            <span className="text-sm">
                              {transaction.transactionDate
                                ? formatDate(
                                    transaction.transactionDate.toString()
                                  )
                                : "N/A"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="mr-1 size-3 text-muted-foreground" />
                            <span className="text-sm">
                              {transaction.expiredAt
                                ? formatDate(transaction.expiredAt.toString())
                                : "N/A"}
                            </span>
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
          <CardTitle>Additional Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Created At
              </p>
              <div className="flex items-center">
                <Calendar className="mr-1 size-3 text-muted-foreground" />
                <p className="text-sm">
                  {digitalBorrow.transactions[0]?.createdAt
                    ? formatDate(
                        digitalBorrow.transactions[0].createdAt.toString()
                      )
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Cancelled At
              </p>
              <div className="flex items-center">
                <Calendar className="mr-1 size-3 text-muted-foreground" />
                <p className="text-sm">
                  {digitalBorrow.transactions[0]?.cancelledAt
                    ? formatDate(
                        digitalBorrow.transactions[0].cancelledAt.toString()
                      )
                    : "N/A"}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">
                Description
              </p>
              <p className="text-sm">
                {digitalBorrow.transactions[0]?.description ||
                  "No description available"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DigitalBorrowDetail
