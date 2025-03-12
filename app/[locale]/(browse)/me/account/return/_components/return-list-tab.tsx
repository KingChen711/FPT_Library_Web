"use client"

import { useState } from "react"
import Image from "next/image"
import { differenceInDays, format } from "date-fns"
import { Book, BookOpen, Calendar, RotateCcw } from "lucide-react"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { dummyBooks } from "@/app/[locale]/(browse)/(home)/_components/dummy-books"

import BorrowedReturnFilter from "./borrowed-return-filter"
import {
  activeBorrowedItems,
  returnedOrLostItems,
  type BorrowedItem,
  type BorrowStatus,
  type ItemType,
  type ReturnCondition,
} from "./dummy-return"
import ReturnBorrowedForm from "./return-borrowed-form"

// Helper functions
const formatDate = (dateString: string): string => {
  return format(new Date(dateString), "MMM dd, yyyy")
}

const getDaysUntilDue = (dueDate: string): number => {
  const today = new Date()
  const due = new Date(dueDate)
  return differenceInDays(due, today)
}

const getStatusColor = (status: BorrowStatus): string => {
  switch (status) {
    case "borrowed":
      return "bg-green-100 text-green-800"
    case "overdue":
      return "bg-red-100 text-red-800"
    case "returned":
      return "bg-blue-100 text-blue-800"
    case "lost":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getConditionColor = (condition: ReturnCondition): string => {
  switch (condition) {
    case "excellent":
      return "bg-green-100 text-green-800"
    case "good":
      return "bg-blue-100 text-blue-800"
    case "fair":
      return "bg-yellow-100 text-yellow-800"
    case "damaged":
      return "bg-orange-100 text-orange-800"
    case "lost":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getItemTypeIcon = (type: ItemType) => {
  switch (type) {
    case "book":
      return <Book className="size-4" />
    case "ebook":
      return <BookOpen className="size-4" />
    case "audiobook":
      return <BookOpen className="size-4" />
    case "journal":
      return <BookOpen className="size-4" />
    case "magazine":
      return <BookOpen className="size-4" />
    case "dvd":
      return <BookOpen className="size-4" />
    default:
      return <Book className="size-4" />
  }
}

const ReturnPage = () => {
  const [showReturnDialog, setShowReturnDialog] = useState(false)
  const [selectedItem, setSelectedItem] = useState<BorrowedItem | null>(null)

  const handleReturn = (item: BorrowedItem) => {
    setSelectedItem(item)
    setShowReturnDialog(true)
  }

  return (
    <div className="space-y-6">
      {selectedItem && (
        <ReturnBorrowedForm
          selectedItem={selectedItem}
          setShowReturnDialog={setShowReturnDialog}
          showReturnDialog={showReturnDialog}
        />
      )}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <CardTitle>Currently Borrowed Items</CardTitle>
            <BorrowedReturnFilter />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Borrow Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Late Fee</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeBorrowedItems.map((borrowedItem, index) => {
                    const daysUntilDue = getDaysUntilDue(borrowedItem.dueDate)
                    const isOverdue = daysUntilDue < 0

                    return (
                      <TableRow key={borrowedItem.id}>
                        <TableCell>
                          <div className="flex items-start gap-3">
                            <Image
                              src={
                                dummyBooks[index % dummyBooks.length].image ||
                                ""
                              }
                              alt={"Selected Book"}
                              width={30}
                              height={40}
                              className="rounded-md object-cover"
                            />
                            <div>
                              <div className="font-medium">
                                {borrowedItem.item.title}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                by {borrowedItem.item.author}
                              </div>
                              <div className="flex items-center text-xs text-muted-foreground">
                                {getItemTypeIcon(borrowedItem.item.type)}
                                <span className="ml-1 capitalize">
                                  {borrowedItem.item.type}
                                </span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="mr-1 size-3 text-muted-foreground" />
                            <span>{formatDate(borrowedItem.borrowDate)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <Calendar className="mr-1 size-3 text-muted-foreground" />
                              <span>{formatDate(borrowedItem.dueDate)}</span>
                            </div>
                            {isOverdue ? (
                              <span className="text-xs font-medium text-danger">
                                {Math.abs(daysUntilDue)} days overdue
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                {daysUntilDue} days remaining
                              </span>
                            )}
                            <Progress
                              value={Math.min(
                                100,
                                ((14 - Math.min(daysUntilDue, 14)) / 14) * 100
                              )}
                              className={
                                isOverdue
                                  ? "bg-danger"
                                  : daysUntilDue <= 3
                                    ? "bg-yellow-500"
                                    : ""
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getStatusColor(borrowedItem.status)}
                          >
                            {borrowedItem.status.charAt(0).toUpperCase() +
                              borrowedItem.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {borrowedItem.lateFee > 0 ? (
                            <span className="font-medium text-danger">
                              ${borrowedItem.lateFee.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">None</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReturn(borrowedItem)}
                            className="text-primary hover:bg-primary/10"
                          >
                            <RotateCcw className="mr-2 size-4" />
                            Return
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {returnedOrLostItems.length > 0 && (
              <div>
                <h3 className="mb-4 text-lg font-medium">
                  Recently Returned or Lost Items
                </h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Borrow Date</TableHead>
                        <TableHead>Return Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>Late Fee</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {returnedOrLostItems.map((borrowedItem, index) => (
                        <TableRow key={borrowedItem.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Image
                                src={
                                  dummyBooks[index % dummyBooks.length].image ||
                                  ""
                                }
                                alt={"Selected Book"}
                                width={30}
                                height={40}
                                className="rounded-md object-cover"
                              />
                              <div>
                                <div className="font-medium">
                                  {borrowedItem.item.title}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  by {borrowedItem.item.author}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {formatDate(borrowedItem.borrowDate)}
                          </TableCell>
                          <TableCell>
                            {borrowedItem.returnDate
                              ? formatDate(borrowedItem.returnDate)
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={getStatusColor(borrowedItem.status)}
                            >
                              {borrowedItem.status.charAt(0).toUpperCase() +
                                borrowedItem.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {borrowedItem.condition ? (
                              <Badge
                                className={getConditionColor(
                                  borrowedItem.condition
                                )}
                              >
                                {borrowedItem.condition
                                  .charAt(0)
                                  .toUpperCase() +
                                  borrowedItem.condition.slice(1)}
                              </Badge>
                            ) : (
                              "N/A"
                            )}
                          </TableCell>
                          <TableCell>
                            {borrowedItem.lateFee > 0 ? (
                              <span className="font-medium text-danger">
                                ${borrowedItem.lateFee.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">
                                None
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ReturnPage
