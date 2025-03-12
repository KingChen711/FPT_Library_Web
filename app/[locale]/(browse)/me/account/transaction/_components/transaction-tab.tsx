import { ArrowUpDown, Calendar, MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

import { currentTransactions } from "./dummy-transaction"
import LibraryTransactionFilter from "./library-transaction-filter"

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

const statusColors: Record<string, string> = {
  completed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  failed: "bg-red-100 text-red-800",
  refunded: "bg-blue-100 text-blue-800",
  processing: "bg-purple-100 text-purple-800",
}

const TransactionTab = () => {
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
              <TableHead className="w-12">
                <Checkbox onCheckedChange={() => {}} aria-label="Select all" />
              </TableHead>
              <TableHead>
                <div className="flex w-[100px] cursor-pointer items-center">
                  ID
                  <ArrowUpDown className="ml-2 size-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex w-[180px] cursor-pointer items-center">
                  Date
                  <ArrowUpDown className="ml-2 size-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex cursor-pointer items-center">
                  Customer
                  <ArrowUpDown className="ml-2 size-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex cursor-pointer items-center">
                  Type
                  <ArrowUpDown className="ml-2 size-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex cursor-pointer items-center">
                  Amount
                  <ArrowUpDown className="ml-2 size-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex cursor-pointer items-center">
                  Status
                  <ArrowUpDown className="ml-2 size-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex cursor-pointer items-center">
                  Payment Method
                  <ArrowUpDown className="ml-2 size-4" />
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <Checkbox aria-label={`Select ${transaction.id}`} />
                </TableCell>
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <Calendar className="mr-2 size-4 text-muted-foreground" />
                          <span>{formatDate(transaction.date)}</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>IP: {transaction.ipAddress}</p>
                        <p>Device: {transaction.device}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{transaction.customer.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {transaction.customer.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="capitalize">{transaction.type}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {transaction.amount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Fee:{" "}
                      {transaction.fee.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${statusColors[transaction.status] || "bg-gray-100 text-gray-800"}`}
                  >
                    {transaction.status.charAt(0).toUpperCase() +
                      transaction.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="capitalize">
                  {transaction.paymentMethod.replace("_", " ")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="size-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Download receipt</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Refund transaction</DropdownMenuItem>
                      <DropdownMenuItem className="text-danger">
                        Cancel transaction
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default TransactionTab
