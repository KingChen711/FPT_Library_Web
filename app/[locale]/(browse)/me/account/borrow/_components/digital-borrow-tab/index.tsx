import getBorrowDigitalsPatron from "@/queries/borrows/get-borrow-digitals-patron"
import { differenceInCalendarDays, format, parseISO } from "date-fns"
import { Calendar, CheckCircle, Filter, Search, XCircle } from "lucide-react"

import { getTranslations } from "@/lib/get-translations"
import { type BorrowItem } from "@/lib/types/models"
import { formatPrice } from "@/lib/utils"
import BorrowDigitalStatusBadge from "@/components/ui/borrow-digital-status-badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import Paginator from "@/components/ui/paginator"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import DigitalBorrowActions from "./digital-borrow-actions"

const formatDate = (dateString: string): string => {
  return format(new Date(dateString), "MMM dd, yyyy")
}

const DigitalBorrowTab = async () => {
  const t = await getTranslations("BookPage.borrow tracking")

  const {
    sources: digitalBorrows,
    totalActualItem,
    pageIndex,
    pageSize,
    totalPage,
  } = await getBorrowDigitalsPatron({
    pageIndex: 1,
    pageSize: "10",
    search: "",
    registerDateRange: [],
    expiryDateRange: [],
    isExtended: false,
    f: [],
    o: [],
    v: [],
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div className="flex gap-2">
          <Input placeholder={t("search")} className="w-full sm:w-64" />
          <Button variant="secondary" size="icon">
            <Search className="size-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 size-4" />
                {t("filter")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{t("created")}</DropdownMenuItem>
              <DropdownMenuItem>{t("expired")}</DropdownMenuItem>
              <DropdownMenuItem>{t("borrowed")}</DropdownMenuItem>
              <DropdownMenuItem>{t("cancelled")}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("ordinal number")}</TableHead>
              <TableHead>{t("title")}</TableHead>
              <TableHead>{t("register date")}</TableHead>
              <TableHead>{t("expiration date")}</TableHead>
              <TableHead>{t("borrow price")}</TableHead>
              <TableHead>{t("is extended")}</TableHead>
              <TableHead>{t("extension count")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {digitalBorrows.map((borrowedItem: BorrowItem, index) => {
              const registerDate = parseISO(borrowedItem.registerDate)
              const expiryDate = parseISO(borrowedItem.expiryDate)
              const now = new Date()

              // Số ngày còn lại (có thể âm nếu đã quá hạn)
              const daysUntilDue = differenceInCalendarDays(expiryDate, now)

              const isOverdue = daysUntilDue < 0

              // Tổng số ngày mượn (ở đây là 14 ngày cố định, hoặc tính động nếu cần)
              const totalDays = differenceInCalendarDays(
                expiryDate,
                registerDate
              )

              // Số ngày đã trôi qua
              const daysPassed = differenceInCalendarDays(now, registerDate)

              // Tính phần trăm tiến độ
              const progressPercent = Math.min(
                100,
                (daysPassed / totalDays) * 100
              )
              return (
                <TableRow key={borrowedItem.digitalBorrowId}>
                  <TableCell>
                    <div className="flex items-start gap-3">{index + 1}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      {borrowedItem.libraryResource.resourceTitle}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-1 size-3 text-muted-foreground" />
                      <span>{formatDate(borrowedItem.registerDate)}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Calendar className="mr-1 size-3 text-muted-foreground" />
                        <span>{formatDate(borrowedItem.expiryDate)}</span>
                      </div>
                      {isOverdue ? (
                        <span className="text-xs font-medium text-danger">
                          {Math.abs(daysUntilDue)} {t("days overdue")}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {daysUntilDue} {t("days remaining")}
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
                    <span>
                      {formatPrice(borrowedItem.libraryResource.borrowPrice!)}
                    </span>
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
                      <BorrowDigitalStatusBadge status={borrowedItem.status} />
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
            })}
          </TableBody>
        </Table>
      </div>

      <Paginator
        pageIndex={pageIndex}
        totalActualItem={totalActualItem}
        totalPage={totalPage}
        pageSize={pageSize}
      />
    </div>
  )
}

export default DigitalBorrowTab
