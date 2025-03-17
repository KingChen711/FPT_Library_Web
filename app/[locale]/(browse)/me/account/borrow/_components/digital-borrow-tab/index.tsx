import getDigitalBorrows from "@/queries/borrows/get-digital-borrows"
import { differenceInCalendarDays, format, parseISO } from "date-fns"
import { Calendar, CheckCircle, XCircle } from "lucide-react"

import { type BorrowItem } from "@/lib/types/models"
import BorrowDigitalStatusBadge from "@/components/ui/borrow-digital-status-badge"
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

import BorrowedReturnFilter from "../../../return/_components/borrowed-return-filter"
import DigitalBorrowActions from "./digital-borrow-actions"

const formatDate = (dateString: string): string => {
  return format(new Date(dateString), "MMM dd, yyyy")
}

const DigitalBorrowTab = async () => {
  const digitalBorrows = await getDigitalBorrows()
  console.log("🚀 ~ DigitalBorrowTab ~ digitalBorrows:", digitalBorrows)

  return (
    <div className="space-y-6">
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
                    <TableHead>No</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Register date</TableHead>
                    <TableHead>Expiry date</TableHead>
                    <TableHead>Is extended</TableHead>
                    <TableHead>Extension count</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {digitalBorrows.sources.map(
                    (borrowedItem: BorrowItem, index) => {
                      const registerDate = parseISO(borrowedItem.registerDate)
                      const expiryDate = parseISO(borrowedItem.expiryDate)
                      const now = new Date()

                      // Số ngày còn lại (có thể âm nếu đã quá hạn)
                      const daysUntilDue = differenceInCalendarDays(
                        expiryDate,
                        now
                      )

                      const isOverdue = daysUntilDue < 0

                      // Tổng số ngày mượn (ở đây là 14 ngày cố định, hoặc tính động nếu cần)
                      const totalDays = differenceInCalendarDays(
                        expiryDate,
                        registerDate
                      )

                      // Số ngày đã trôi qua
                      const daysPassed = differenceInCalendarDays(
                        now,
                        registerDate
                      )

                      // Tính phần trăm tiến độ
                      const progressPercent = Math.min(
                        100,
                        (daysPassed / totalDays) * 100
                      )
                      return (
                        <TableRow key={borrowedItem.digitalBorrowId}>
                          <TableCell>
                            <div className="flex items-start gap-3">
                              {index + 1}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-start gap-3">
                              {borrowedItem.libraryResource.resourceTitle}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="mr-1 size-3 text-muted-foreground" />
                              <span>
                                {formatDate(borrowedItem.registerDate)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <Calendar className="mr-1 size-3 text-muted-foreground" />
                                <span>
                                  {formatDate(borrowedItem.expiryDate)}
                                </span>
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
                                value={progressPercent}
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
                            <div className="flex items-center">
                              {borrowedItem.isExtended ? (
                                <CheckCircle size={20} color="green" />
                              ) : (
                                <XCircle size={20} color="red" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span>{borrowedItem.extensionCount}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {/* {borrowedItem.status}{" "} */}
                              <BorrowDigitalStatusBadge
                                status={borrowedItem.status}
                              />
                            </div>
                          </TableCell>

                          <TableCell className="text-right">
                            <DigitalBorrowActions
                              resourceId={borrowedItem.resourceId}
                              borrowItem={borrowedItem}
                              // borrowedItemId={borrowedItem.digitalBorrowId}
                            />
                          </TableCell>
                        </TableRow>
                      )
                    }
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DigitalBorrowTab
