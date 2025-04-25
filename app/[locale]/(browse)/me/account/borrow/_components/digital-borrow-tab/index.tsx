import getBorrowDigitalsPatron from "@/queries/borrows/get-borrow-digitals-patron"
import { differenceInCalendarDays, format } from "date-fns"
import { AlertOctagonIcon, Calendar, CheckCircle, XCircle } from "lucide-react"

import { getLocale } from "@/lib/get-locale"
import { getTranslations } from "@/lib/get-translations"
import { formatPrice } from "@/lib/utils"
import { searchBorrowDigitalsSchema } from "@/lib/validations/borrow-digitals/search-borrow-digitals"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import BorrowDigitalStatusBadge from "@/components/ui/borrow-digital-status-badge"
import Paginator from "@/components/ui/paginator"
import ParamSearchForm from "@/components/ui/param-search-form"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import ResourceBookTypeBadge from "@/components/badges/book-resource-type-badge"

import DigitalBorrowActions from "./digital-borrow-actions"
import FiltersBorrowDigitalsDialog from "./filters-borow-digitals-dialog"

type Props = {
  searchParams: Record<string, string | string[] | undefined>
}

const DigitalBorrowTab = async ({ searchParams }: Props) => {
  const t = await getTranslations("BookPage.borrow tracking")
  const { searchDigital, pageIndex, sort, pageSize, ...rest } =
    searchBorrowDigitalsSchema.parse(searchParams)
  const locale = await getLocale()

  const {
    sources: digitalBorrows,
    totalActualItem,
    totalPage,
  } = await getBorrowDigitalsPatron({
    search: searchDigital,
    pageIndex,
    sort,
    pageSize,
    ...rest,
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-row items-center">
            <ParamSearchForm
              searchKey="searchDigital"
              className="h-full rounded-r-none border-r-0"
              search={searchDigital}
            />
            <FiltersBorrowDigitalsDialog />
          </div>
        </div>
      </div>

      <Alert variant="info" className="bg-muted">
        <AlertOctagonIcon className="size-4" />
        <AlertTitle className="font-bold">
          {locale === "vi" ? "Sách nói!" : "Audio book!"}
        </AlertTitle>
        <AlertDescription>
          {locale === "vi"
            ? "Sau khi thuê sách nói, hệ thống cần 5–10 phút để chuẩn bị. Bạn chỉ cần chờ lần đầu, không cần chờ mỗi lần nghe."
            : "After renting an audiobook, the system needs 5–10 minutes to prepare it. Just wait once — no need to wait every time you listen."}
        </AlertDescription>
      </Alert>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("ordinal number")}</TableHead>
              <TableHead>{t("title")}</TableHead>
              <TableHead>{t("type")}</TableHead>
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
            {digitalBorrows.map((item, index) => {
              const now = new Date()

              // Số ngày còn lại (có thể âm nếu đã quá hạn)
              const daysUntilDue = differenceInCalendarDays(
                item.expiryDate,
                now
              )

              const isOverdue = daysUntilDue < 0

              // Tổng số ngày mượn (ở đây là 14 ngày cố định, hoặc tính động nếu cần)
              const totalDays = differenceInCalendarDays(
                item.expiryDate,
                item?.registerDate
              )

              // Số ngày đã trôi qua
              const daysPassed = differenceInCalendarDays(
                now,
                item?.registerDate
              )

              // Tính phần trăm tiến độ
              const progressPercent = Math.min(
                100,
                (daysPassed / totalDays) * 100
              )
              return (
                <TableRow key={item.digitalBorrowId}>
                  <TableCell>
                    <div className="flex items-start gap-3">{index + 1}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      {item.libraryResource.resourceTitle}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-3">
                      <ResourceBookTypeBadge
                        status={item.libraryResource.resourceType}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-1 size-3 text-muted-foreground" />
                      <span>
                        {format(
                          new Date(item?.registerDate),
                          "HH:mm dd/MM/yyyy"
                        )}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Calendar className="mr-1 size-3 text-muted-foreground" />
                        <span>
                          {format(
                            new Date(item.expiryDate),
                            "HH:mm dd/MM/yyyy"
                          )}
                        </span>
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
                      {formatPrice(item.libraryResource.borrowPrice!)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {item.isExtended ? (
                        <CheckCircle size={20} color="green" />
                      ) : (
                        <XCircle size={20} color="red" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span>{item.extensionCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <BorrowDigitalStatusBadge status={item.status} />
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <DigitalBorrowActions
                      borrowItem={item}

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
        pageSize={+pageSize}
        pageIndex={pageIndex}
        totalPage={totalPage}
        totalActualItem={totalActualItem}
        className="mt-6"
      />
    </div>
  )
}

export default DigitalBorrowTab
