"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Link } from "@/i18n/routing"
import {
  AlertCircle,
  ArrowLeft,
  AudioLines,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Clock3,
  FileText,
  Globe,
  HomeIcon as House,
  Loader2,
  XCircle,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { EResourceBookType } from "@/lib/types/enums"
import { formatDate } from "@/lib/utils"
import useBorrowRequestDetail from "@/hooks/library-items/use-borrow-request-detail"
import { Badge } from "@/components/ui/badge"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import BorrowRequestTransactionDialog from "../_components/borrow-request-transaction-dialog"

type Props = {
  params: {
    borrowRequestId: number
  }
}

// Helper function to get request status label
const getBorrowRequestStatusLabel = (
  status: number
): {
  label: string
  variant: "success" | "warning" | "info" | "destructive" | "default"
  color: string
  icon: React.ReactNode
} => {
  switch (status) {
    case 0:
      return {
        label: "created",
        variant: "warning",
        color: "bg-yellow-500",
        icon: <Clock3 className="mr-1.5 size-3.5" />,
      }
    case 1:
      return {
        label: "expired",
        variant: "destructive",
        color: "bg-red-500",
        icon: <AlertCircle className="mr-1.5 size-3.5" />,
      }
    case 2:
      return {
        label: "borrowed",
        variant: "success",
        color: "bg-green-500",
        icon: <CheckCircle2 className="mr-1.5 size-3.5" />,
      }
    case 3:
      return {
        label: "cancelled",
        variant: "default",
        color: "bg-gray-500",
        icon: <XCircle className="mr-1.5 size-3.5" />,
      }
    default:
      return {
        label: "cancelled",
        variant: "default",
        color: "bg-gray-400",
        icon: <XCircle className="mr-1.5 size-3.5" />,
      }
  }
}

// Helper function to get queue status label
const getBorrowQueueStatusLabel = (status: number) => {
  switch (status) {
    case 0:
      return {
        label: "Waiting",
        color: "bg-blue-500",
        icon: <Clock className="mr-1.5 size-3.5" />,
      }
    case 1:
      return {
        label: "Ready for Pickup",
        color: "bg-green-500",
        icon: <CheckCircle2 className="mr-1.5 size-3.5" />,
      }
    case 2:
      return {
        label: "Collected",
        color: "bg-purple-500",
        icon: <CheckCircle2 className="mr-1.5 size-3.5" />,
      }
    case 3:
      return {
        label: "Expired",
        color: "bg-red-500",
        icon: <AlertCircle className="mr-1.5 size-3.5" />,
      }
    case 4:
      return {
        label: "Cancelled",
        color: "bg-gray-500",
        icon: <XCircle className="mr-1.5 size-3.5" />,
      }
    default:
      return {
        label: "Unknown",
        color: "bg-gray-400",
        icon: <AlertCircle className="mr-1.5 size-3.5" />,
      }
  }
}

const BorrowRequestDetail = ({ params }: Props) => {
  const [openTransaction, setOpenTransaction] = useState(false)
  const t = useTranslations("BookPage.borrow tracking")
  const { data: borrowRequest, isLoading } = useBorrowRequestDetail(
    params.borrowRequestId
  )

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-12 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (!borrowRequest) {
    return <NoData />
  }

  console.log("🚀 ~ BorrowRequestDetail ~ borrowRequest:", borrowRequest)

  return (
    <div className="container mx-auto py-6">
      <BorrowRequestTransactionDialog
        borrowRequestId={params.borrowRequestId}
        open={openTransaction}
        setOpen={setOpenTransaction}
      />
      <div className="mb-6 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            asChild
            className="rounded-full shadow-sm hover:shadow"
          >
            <Link href="/me/account/borrow">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{t("digital borrow detail")}</h1>
        </div>

        {borrowRequest.isExistPendingResources && (
          <Button onClick={() => setOpenTransaction(true)}>
            {t("payment")}
          </Button>
        )}
      </div>

      {/* Status overview card */}
      <Card className="mb-6 overflow-hidden border-none bg-gradient-to-r from-primary/10 to-primary/5 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-primary">
                {t("status")}
              </h2>
              <div className="mt-2 flex items-center">
                <Badge
                  variant={
                    getBorrowRequestStatusLabel(borrowRequest.status).variant
                  }
                  className="flex items-center px-3 py-1 text-sm font-medium"
                >
                  {getBorrowRequestStatusLabel(borrowRequest.status).icon}
                  {t(getBorrowRequestStatusLabel(borrowRequest.status).label)}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:flex md:items-center md:gap-6">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  {t("request date")}
                </span>
                <span className="flex items-center font-medium">
                  <Calendar className="mr-1.5 size-3.5 text-primary" />
                  {formatDate(borrowRequest.requestDate.toString())}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  {t("expiration date")}
                </span>
                <span className="flex items-center font-medium">
                  <Clock className="mr-1.5 size-3.5 text-primary" />
                  {borrowRequest.expirationDate ? (
                    formatDate(borrowRequest.expirationDate.toString())
                  ) : (
                    <NoData />
                  )}
                </span>
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">
                  {t("total items")}
                </span>
                <span className="flex items-center font-medium">
                  <BookOpen className="mr-1.5 size-3.5 text-primary" />
                  {borrowRequest.totalRequestItem}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Request Information Card */}
        <Card className="overflow-hidden shadow-sm transition-all hover:shadow-md lg:col-span-1">
          <CardHeader className="bg-muted/30 pb-3">
            <CardTitle className="flex items-center text-lg">
              <FileText className="mr-2 size-5 text-primary" />
              {t("request details")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {borrowRequest.description && (
                <div className="rounded-md bg-muted/20 p-3">
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                    {t("description")}
                  </h3>
                  <p className="text-sm">{borrowRequest.description}</p>
                </div>
              )}

              {borrowRequest.cancelledAt && (
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                    {t("cancelled at")}
                  </h3>
                  <p className="text-sm">
                    {formatDate(borrowRequest.cancelledAt.toString())}
                  </p>
                </div>
              )}

              {borrowRequest.cancellationReason && (
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                    {t("cancellation reason")}
                  </h3>
                  <p className="text-sm">{borrowRequest.cancellationReason}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                    {t("reminder sent")}
                  </h3>
                  <Badge
                    variant={
                      borrowRequest.isReminderSent ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {borrowRequest.isReminderSent ? t("yes") : t("no")}
                  </Badge>
                </div>

                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                    {t("pending resources")}
                  </h3>
                  <Badge
                    variant={
                      borrowRequest.isExistPendingResources
                        ? "danger"
                        : "default"
                    }
                    className="text-xs"
                  >
                    {borrowRequest.isExistPendingResources ? t("yes") : t("no")}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Library Items Card */}
        <Card className="overflow-hidden shadow-sm transition-all hover:shadow-md lg:col-span-2">
          <CardHeader className="bg-muted/30 pb-3">
            <CardTitle className="flex items-center text-lg">
              <BookOpen className="mr-2 size-5 text-primary" />
              {t("library items")}
            </CardTitle>
            <CardDescription>
              {t("library items information description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {borrowRequest.libraryItems.map((libraryItem) => (
                <Card
                  key={libraryItem.libraryItemId}
                  className="overflow-hidden border border-muted/50 transition-all hover:border-primary/20 hover:shadow-md"
                >
                  <div className="flex flex-col p-4 sm:flex-row">
                    <div className="relative mb-4 h-[160px] w-full max-w-[120px] overflow-hidden rounded-md sm:mb-0 sm:mr-4">
                      <Image
                        src={
                          libraryItem.coverImage ||
                          "/placeholder.svg?height=160&width=120" ||
                          "/placeholder.svg"
                        }
                        fill
                        style={{ objectFit: "cover" }}
                        alt={libraryItem.title}
                        className="rounded-md"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex w-full items-start justify-between">
                        <div className="w-full">
                          <div className="flex items-center justify-between">
                            <h3 className="line-clamp-1 flex-1 font-semibold text-primary">
                              {libraryItem.title}
                            </h3>
                          </div>
                          <div className="mt-1 flex items-center">
                            <Icons.User className="mr-1.5 size-3.5 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {libraryItem.authors[0]?.fullName}
                            </p>
                          </div>
                        </div>
                      </div>

                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                        {libraryItem.summary}
                      </p>

                      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 md:grid-cols-4">
                        {libraryItem.publicationYear && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="mr-1.5 size-3.5 text-primary/70" />
                            <span>{libraryItem.publicationYear}</span>
                          </div>
                        )}

                        {libraryItem.language && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Globe className="mr-1.5 size-3.5 text-primary/70" />
                            <span>{libraryItem.language}</span>
                          </div>
                        )}

                        {libraryItem.pageCount && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <BookOpen className="mr-1.5 size-3.5 text-primary/70" />
                            <span>
                              {libraryItem.pageCount} {t("pages")}
                            </span>
                          </div>
                        )}

                        {libraryItem.publicationPlace && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <House className="mr-1.5 size-3.5 shrink-0 text-primary/70" />
                            <span className="truncate">
                              {libraryItem.publicationPlace}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reservation Queue Card */}
        {borrowRequest.reservationQueues.length > 0 && (
          <Card className="overflow-hidden shadow-sm transition-all hover:shadow-md lg:col-span-3">
            <CardHeader className="bg-muted/30 pb-3">
              <CardTitle className="flex items-center text-lg">
                <Clock className="mr-2 size-5 text-primary" />
                {t("reservation queue")}
              </CardTitle>
              <CardDescription>
                {t("reservation queue description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("status")}</TableHead>
                      <TableHead>{t("reservation date")}</TableHead>
                      <TableHead>{t("expiry date")}</TableHead>
                      <TableHead>{t("expected available date")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {borrowRequest.reservationQueues.map((queue) => {
                      const queueStatus = getBorrowQueueStatusLabel(
                        queue.queueStatus
                      )
                      return (
                        <TableRow key={queue.queueId}>
                          <TableCell>
                            <Badge
                              className="flex w-fit items-center gap-1 px-2 py-1"
                              style={{ backgroundColor: queueStatus.color }}
                            >
                              {queueStatus.icon}
                              {queueStatus.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {formatDate(queue.reservationDate.toString())}
                          </TableCell>
                          <TableCell>
                            {queue.expiryDate
                              ? formatDate(queue.expiryDate.toString())
                              : t("not available")}
                          </TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help underline decoration-dotted">
                                    {formatDate(
                                      queue.expectedAvailableDateMin
                                        ? queue.expectedAvailableDateMin.toString()
                                        : t("not available")
                                    )}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {t("expected available range")}:
                                    {formatDate(
                                      queue.expectedAvailableDateMin
                                        ? queue.expectedAvailableDateMin.toString()
                                        : t("not available")
                                    )}
                                    -
                                    {formatDate(
                                      queue.expectedAvailableDateMax
                                        ? queue.expectedAvailableDateMax.toString()
                                        : t("not available")
                                    )}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Borrow Request Resources Card */}
        {borrowRequest.borrowRequestResources.length > 0 && (
          <Card className="overflow-hidden shadow-sm transition-all hover:shadow-md lg:col-span-3">
            <CardHeader className="bg-muted/30 pb-3">
              <CardTitle className="flex items-center text-lg">
                <FileText className="mr-2 size-5 text-primary" />
                {t("borrow request resource")}
              </CardTitle>
              <CardDescription>
                {t("borrow request resource description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {borrowRequest.borrowRequestResources.map((resource) => (
                  <Card
                    key={resource.borrowRequestResourceId}
                    className="overflow-hidden border border-muted/50 transition-all hover:border-primary/20 hover:shadow-md"
                  >
                    <CardHeader className="bg-muted/10 pb-2 pt-3">
                      <CardTitle className="line-clamp-1 text-base">
                        {resource?.resourceTitle}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="progress"
                            className="flex items-center gap-1 border-primary/20 bg-primary/5 text-xs font-normal text-primary"
                          >
                            {resource.libraryResource.resourceType ===
                            EResourceBookType.EBOOK ? (
                              <>
                                <BookOpen className="size-3" />
                                {t("ebook")}
                              </>
                            ) : (
                              <>
                                <AudioLines className="size-3" />
                                {t("audio book")}
                              </>
                            )}
                          </Badge>
                        </div>

                        {resource.defaultBorrowDurationDays && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="mr-1.5 size-3.5" />
                            {t("borrow duration")}:
                            {resource.defaultBorrowDurationDays}
                            {t("days")}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default BorrowRequestDetail
