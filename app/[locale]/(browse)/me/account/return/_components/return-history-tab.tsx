import Image from "next/image"
import { format } from "date-fns"
import { Calendar } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { dummyBooks } from "@/app/[locale]/(browse)/(home)/_components/dummy-books"

import {
  returnHistory,
  type ReturnCondition,
  type ReturnHistory,
} from "./dummy-return"

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

const formatDate = (dateString: string): string => {
  return format(new Date(dateString), "MMM dd, yyyy")
}

const ReturnHistoryTab = () => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Return History</CardTitle>
          <CardDescription>
            View your complete history of returned library items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Borrow Period</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Late Fee</TableHead>
                  <TableHead>Payment Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {returnHistory.map((history: ReturnHistory, index: number) => (
                  <TableRow key={history.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={
                            dummyBooks[index % dummyBooks.length].image || ""
                          }
                          alt={"Selected Book"}
                          width={30}
                          height={40}
                          className="rounded-md object-cover"
                        />
                        <div>
                          <div className="font-medium">
                            {history.borrowedItem.item.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            by {history.borrowedItem.item.author}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ID: {history.borrowId}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <Calendar className="mr-1 size-3 text-muted-foreground" />
                          <span className="text-xs">
                            From: {formatDate(history.borrowedItem.borrowDate)}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center">
                          <Calendar className="mr-1 size-3 text-muted-foreground" />
                          <span className="text-xs">
                            Due: {formatDate(history.borrowedItem.dueDate)}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(history.returnDate)}</TableCell>
                    <TableCell>
                      <Badge className={getConditionColor(history.condition)}>
                        {history.condition.charAt(0).toUpperCase() +
                          history.condition.slice(1)}
                      </Badge>
                      {history.notes && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          {history.notes}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      {history.lateFee > 0 ? (
                        <span className="font-medium text-danger">
                          ${history.lateFee.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {history.lateFee > 0 ? (
                        history.paid ? (
                          <Badge className="bg-green-100 text-green-800">
                            Paid
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">
                            Unpaid
                          </Badge>
                        )
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

export default ReturnHistoryTab
