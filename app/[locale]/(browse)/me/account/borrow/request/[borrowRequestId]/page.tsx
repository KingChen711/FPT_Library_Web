"use client"

import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import {
  ArrowLeft,
  Book,
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Info,
  Loader2,
  X,
} from "lucide-react"

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
import NoData from "@/components/ui/no-data"
import { Separator } from "@/components/ui/separator"

type Props = {
  params: {
    borrowRequestId: number
  }
}

// Helper function to get request status label
const getRequestStatusLabel = (status: number) => {
  switch (status) {
    case 0:
      return { label: "Pending", color: "bg-yellow-500" }
    case 1:
      return { label: "Approved", color: "bg-green-500" }
    case 2:
      return { label: "Rejected", color: "bg-red-500" }
    case 3:
      return { label: "Cancelled", color: "bg-gray-500" }
    default:
      return { label: "Unknown", color: "bg-gray-400" }
  }
}

// Helper function to get queue status label
const getQueueStatusLabel = (status: number) => {
  switch (status) {
    case 0:
      return { label: "Waiting", color: "bg-blue-500" }
    case 1:
      return { label: "Ready for Pickup", color: "bg-green-500" }
    case 2:
      return { label: "Collected", color: "bg-purple-500" }
    case 3:
      return { label: "Expired", color: "bg-red-500" }
    case 4:
      return { label: "Cancelled", color: "bg-gray-500" }
    default:
      return { label: "Unknown", color: "bg-gray-400" }
  }
}

const BorrowRequestDetail = ({ params }: Props) => {
  // const t = useTranslations("BookPage.borrow tracking")

  const { data: borrowRequest, isLoading } = useBorrowRequestDetail(
    params.borrowRequestId
  )

  console.log("🚀 ~ BorrowRequestDetail ~ borrowRequest:", borrowRequest)

  // Handle cancel request

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

  const requestStatus = getRequestStatusLabel(borrowRequest.status)

  return (
    <div className="container">
      {/* Back button and header */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="mb-4" asChild>
          <Link href="/borrow-requests">
            <ArrowLeft className="mr-2 size-4" />
            Back to Requests
          </Link>
        </Button>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Borrow Request #{borrowRequest.borrowRequestId}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Submitted on{" "}
              {format(
                new Date(borrowRequest.requestDate),
                "MMMM d, yyyy 'at' h:mm a"
              )}
            </p>
          </div>
          <Badge className={`${requestStatus.color} px-3 py-1 text-white`}>
            {requestStatus.label}
          </Badge>
        </div>
      </div>

      {/* Request details */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left column - Request info */}
        <div className="space-y-6 md:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Request Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-muted-foreground">
                  Status
                </div>
                <Badge className={`${requestStatus.color} text-white`}>
                  {requestStatus.label}
                </Badge>
              </div>

              <div>
                <div className="mb-1 text-sm font-medium text-muted-foreground">
                  Request Date
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="size-4 text-muted-foreground" />
                  <span>
                    {format(
                      new Date(borrowRequest.requestDate),
                      "MMMM d, yyyy"
                    )}
                  </span>
                </div>
              </div>

              <div>
                <div className="mb-1 text-sm font-medium text-muted-foreground">
                  Expiration Date
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-muted-foreground" />
                  <span>
                    {format(
                      new Date(borrowRequest.expirationDate),
                      "MMMM d, yyyy"
                    )}
                  </span>
                </div>
              </div>

              {borrowRequest.description && (
                <div>
                  <div className="mb-1 text-sm font-medium text-muted-foreground">
                    Description
                  </div>
                  <div className="text-sm">{borrowRequest.description}</div>
                </div>
              )}

              {borrowRequest.cancelledAt && (
                <>
                  <div>
                    <div className="mb-1 text-sm font-medium text-muted-foreground">
                      Cancelled At
                    </div>
                    <div className="flex items-center gap-2">
                      <X className="size-4 text-muted-foreground" />
                      <span>
                        {format(
                          new Date(borrowRequest.cancelledAt),
                          "MMMM d, yyyy"
                        )}
                      </span>
                    </div>
                  </div>

                  {borrowRequest.cancellationReason && (
                    <div>
                      <div className="mb-1 text-sm font-medium text-muted-foreground">
                        Cancellation Reason
                      </div>
                      <div className="text-sm">
                        {borrowRequest.cancellationReason}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column - Reservation details */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Reservation Details</CardTitle>
              <CardDescription>
                {borrowRequest.reservationQueues.length === 0
                  ? "No items in this request"
                  : `${borrowRequest.reservationQueues.length} item(s) in this request`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {borrowRequest.reservationQueues.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <BookOpen className="mb-4 size-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">
                    No items in this request
                  </h3>
                  <p className="mt-2 max-w-md text-muted-foreground">
                    This borrow request does not have any items. This might be
                    because the request is new or all items have been removed.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {borrowRequest.reservationQueues &&
                    borrowRequest?.reservationQueues?.map((queue) => {
                      const queueStatus = getQueueStatusLabel(queue.queueStatus)

                      return (
                        <div
                          key={queue.queueId}
                          className="overflow-hidden rounded-lg border"
                        >
                          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-[150px_1fr]">
                            {/* Book cover */}
                            <div className="flex justify-center">
                              <div className="relative h-[200px] w-[150px] overflow-hidden rounded-md shadow-md">
                                <Image
                                  src={
                                    queue.libraryItem.coverImage ||
                                    "/placeholder.svg"
                                  }
                                  alt={queue.libraryItem.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </div>

                            {/* Book details */}
                            <div className="flex flex-col">
                              <div className="mb-2 flex items-start justify-between">
                                <div>
                                  <h3 className="line-clamp-2 font-semibold">
                                    {queue.libraryItem.title}
                                  </h3>
                                  {queue.libraryItem.subTitle && (
                                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                                      {queue.libraryItem.subTitle}
                                    </p>
                                  )}
                                </div>
                                <Badge
                                  className={`${queueStatus.color} ml-2 shrink-0 text-white`}
                                >
                                  {queueStatus.label}
                                </Badge>
                              </div>

                              <div className="mt-1 flex items-center gap-2 text-sm">
                                <Book className="size-4 text-muted-foreground" />
                                <span>
                                  {queue.libraryItem.publisher},{" "}
                                  {queue.libraryItem.publicationYear}
                                </span>
                              </div>

                              <div className="mt-1 flex items-center gap-2 text-sm">
                                <Info className="size-4 text-muted-foreground" />
                                <span>ISBN: {queue.libraryItem.isbn}</span>
                              </div>

                              <div className="mt-1 flex items-center gap-2 text-sm">
                                <FileText className="size-4 text-muted-foreground" />
                                <span>{queue.libraryItem.pageCount} pages</span>
                              </div>

                              <Separator className="my-3" />

                              <div className="grid grid-cols-1 gap-2 text-sm">
                                <div className="w-full">
                                  <span className="text-muted-foreground">
                                    Reservation Date:
                                  </span>{" "}
                                  {format(
                                    new Date(queue.reservationDate),
                                    "MMM d, yyyy"
                                  )}
                                </div>

                                {queue.expectedAvailableDateMin && (
                                  <div>
                                    <span className="text-muted-foreground">
                                      Expected Available:
                                    </span>{" "}
                                    {format(
                                      new Date(queue.expectedAvailableDateMin),
                                      "MMM d, yyyy"
                                    )}
                                  </div>
                                )}

                                {queue.expiryDate && (
                                  <div>
                                    <span className="text-muted-foreground">
                                      Expiry Date:
                                    </span>{" "}
                                    {format(
                                      new Date(queue.expiryDate),
                                      "MMM d, yyyy"
                                    )}
                                  </div>
                                )}

                                {queue.reservationCode && (
                                  <div>
                                    <span className="text-muted-foreground">
                                      Reservation Code:
                                    </span>{" "}
                                    <span className="font-medium">
                                      {queue.reservationCode}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="mt-3 flex items-center gap-2">
                                <div className="rounded-full bg-muted px-2 py-1 text-xs">
                                  {queue.libraryItem.category.vietnameseName}
                                </div>
                                <div className="rounded-full bg-muted px-2 py-1 text-xs">
                                  {queue.libraryItem.language.toUpperCase()}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Inventory status */}
                          <div className="bg-muted/50 px-4 py-3 text-sm">
                            <div className="flex flex-wrap gap-x-6 gap-y-2">
                              <div>
                                <span className="text-muted-foreground">
                                  Total:
                                </span>{" "}
                                <span className="font-medium">
                                  {
                                    queue.libraryItem.libraryItemInventory
                                      .totalUnits
                                  }
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Available:
                                </span>{" "}
                                <span className="font-medium">
                                  {
                                    queue.libraryItem.libraryItemInventory
                                      .availableUnits
                                  }
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Borrowed:
                                </span>{" "}
                                <span className="font-medium">
                                  {
                                    queue.libraryItem.libraryItemInventory
                                      .borrowedUnits
                                  }
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">
                                  Reserved:
                                </span>{" "}
                                <span className="font-medium">
                                  {
                                    queue.libraryItem.libraryItemInventory
                                      .reservedUnits
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default BorrowRequestDetail
