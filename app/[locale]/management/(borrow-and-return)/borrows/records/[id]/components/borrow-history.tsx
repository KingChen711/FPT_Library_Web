import Image from "next/image"
import Link from "next/link"
import { type BorrowRecordDetailItem } from "@/queries/borrows/get-borrow-record"
import { format } from "date-fns"
import { BookOpen, Clock } from "lucide-react"

import { getLocale } from "@/lib/get-locale"
import { getTranslations } from "@/lib/get-translations"
import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import BarcodeGenerator from "@/components/ui/barcode-generator"
import LibraryItemCard from "@/components/ui/book-card"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import NoData from "@/components/ui/no-data"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import BorrowRecordStatusBadge from "@/components/badges/borrow-record-status-badge"
import FineBorrowStatusBadge from "@/components/badges/fine-borrow-status"
import FineTypeBadge from "@/components/badges/fine-type-badge"

// Sample data for demonstration

const formatDate = (dateString: string | Date | null) => {
  if (!dateString) return "N/A"
  return format(new Date(dateString), "HH:mm dd/MM/yyyy")
}

export default async function BorrowHistory({
  borrowRecord,
  actions,
}: {
  borrowRecord: BorrowRecordDetailItem
  actions?: React.ReactNode
}) {
  const locale = await getLocale()
  const t = await getTranslations("BorrowAndReturnManagementPage")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-xl font-semibold">{t("Progress")}</h3>
        {actions}
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-progress-100">
              <Clock className="size-4 text-progress" />
            </div>
            <div>
              <Label>{t("Request phase")}</Label>
              <p className="text-sm text-muted-foreground">
                {borrowRecord.borrowRequest?.requestDate
                  ? `${t("Request on")} ${formatDate(borrowRecord.borrowRequest.requestDate)}`
                  : "N/A"}
              </p>
            </div>
            {borrowRecord.borrowRequest?.requestDate ? (
              <Badge className="ml-auto">
                {t("Expires")}:{" "}
                {formatDate(borrowRecord.borrowRequest.expirationDate)}
              </Badge>
            ) : null}
          </div>

          {borrowRecord.borrowRequest ? (
            <div className="space-y-2 pl-10">
              <p className="text-sm">
                <span className="font-medium">
                  {borrowRecord.borrowRequest.totalRequestItem}
                </span>{" "}
                {t("items requested")}:
              </p>
              <div className="grid grid-cols-1 gap-3">
                {borrowRecord.borrowRequest.libraryItems.map((item) => (
                  <div
                    key={item.libraryItemId}
                    className="group flex items-center gap-3 rounded-md border p-2"
                  >
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger>
                          <Link
                            target="_blank"
                            href={`/management/books/${item.libraryItemId}`}
                          >
                            <Image
                              src={item.coverImage || "/placeholder.svg"}
                              alt={item.title}
                              width={144}
                              height={192}
                              className="aspect-[2/3] h-[72px] w-12 rounded-sm border object-cover"
                            />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent
                          align="start"
                          side="left"
                          className="max-h-[80vh] max-w-[calc(100vw-416)] overflow-y-auto bg-card p-0"
                        >
                          <LibraryItemCard libraryItem={item} />
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <div className="truncate text-sm font-bold group-hover:underline">
                      {item.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex w-full justify-center p-8">
              {t("No pre request for borrowing")}
            </div>
          )}
        </div>

        {/* Borrowing Phase */}
        <div className="rounded-lg border p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-info-100">
              <BookOpen className="size-4 text-info" />
            </div>
            <div>
              <Label>{t("Borrowing phase")}</Label>
              <p className="text-sm text-muted-foreground">
                {t("Borrowed on")} {formatDate(borrowRecord.borrowDate)}
              </p>
            </div>
          </div>

          <div className="pl-10">
            <p className="mb-3 text-sm">
              <span className="font-medium">
                {borrowRecord.borrowRecordDetails.length}
              </span>{" "}
              {t("items borrowed")}:
            </p>

            <div className="space-y-3">
              {borrowRecord.borrowRecordDetails.map((detail) => (
                <Card
                  key={detail.libraryItemInstanceId}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-3 p-3">
                    <div className="flex flex-1 items-center gap-3">
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Link
                              target="_blank"
                              href={`/management/books/${detail.libraryItem.libraryItemId}`}
                            >
                              <Image
                                src={
                                  detail.libraryItem.coverImage ||
                                  "/placeholder.svg"
                                }
                                alt={detail.libraryItem.title}
                                width={144}
                                height={192}
                                className="aspect-[2/3] h-[72px] w-12 rounded-sm border object-cover"
                              />
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent
                            align="start"
                            side="left"
                            className="max-h-[80vh] max-w-[calc(100vw-416)] overflow-y-auto bg-card p-0"
                          >
                            <LibraryItemCard libraryItem={detail.libraryItem} />
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <div className="min-w-0 flex-1">
                        <h4 className="truncate font-bold">
                          {detail.libraryItem.title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>
                            {t("Due")}: {formatDate(detail.dueDate)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <BarcodeGenerator
                      value={detail.libraryItem.libraryItemInstances[0].barcode}
                      options={{
                        containerHeight: 64,
                        containerWidth: 230,
                        format: "CODE128",
                        displayValue: true,
                        fontSize: 16,
                        width: 2,
                        height: 24,
                      }}
                    />
                    <div className="flex flex-1 flex-col items-end gap-2">
                      <BorrowRecordStatusBadge status={detail.status} />
                    </div>
                  </div>

                  <div className="px-3 pb-3 pt-0">
                    <Separator className="my-3" />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <Label>{t("Borrow details")}</Label>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              {t("Initial condition")}:
                            </span>
                            {locale === "vi"
                              ? detail.condition.vietnameseName
                              : detail.condition.englishName}
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              {t("Due date")}:
                            </span>
                            <span>{formatDate(detail.dueDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              {t("Extensions count")}:
                            </span>
                            <span>{detail.totalExtension}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label>{t("Return details")}</Label>
                        {detail.returnDate ? (
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                {t("Return condition")}:
                              </span>
                              {locale === "vi"
                                ? detail.returnCondition?.vietnameseName
                                : detail.returnCondition?.englishName}
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                {t("Return date")}:
                              </span>
                              <span>{formatDate(detail.returnDate)}</span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                {t("Condition check")}:
                              </span>
                              <span>
                                {formatDate(detail.conditionCheckDate)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm italic text-muted-foreground">
                            {t("Not returned yet")}
                          </p>
                        )}
                      </div>
                    </div>

                    {detail.fines.length > 0 && (
                      <>
                        <Separator className="my-3" />
                        <div>
                          <Label>{t("Fines")}</Label>
                          <div className="space-y-2">
                            {detail.fines.map((fine, index) => (
                              <div
                                key={index}
                                className="rounded-md border p-3"
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-4">
                                      <h6 className="font-bold">
                                        {fine.finePolicy.finePolicyTitle}
                                      </h6>
                                    </div>
                                    {fine.finePolicy.description && (
                                      <p className="text-sm">
                                        {fine.finePolicy.description}
                                      </p>
                                    )}

                                    <div className="flex items-center gap-1 text-sm">
                                      <p>{t("Fine note")}:</p>
                                      <p>{fine.fineNote || <NoData />}</p>
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-2 text-right">
                                    <div className="flex items-center gap-4">
                                      <FineTypeBadge
                                        type={fine.finePolicy.conditionType}
                                      />
                                      <FineBorrowStatusBadge
                                        status={fine.status}
                                      />
                                    </div>
                                    <div className="font-medium text-danger">
                                      {fine.finePolicy.chargePct
                                        ? formatPrice(
                                            fine.finePolicy.chargePct *
                                              (detail.libraryItem
                                                .estimatedPrice || 0) +
                                              (fine.finePolicy.processingFee ||
                                                0)
                                          )
                                        : formatPrice(
                                            fine.finePolicy.dailyRate || 0
                                          ) + `/${t("day")}`}
                                    </div>
                                    <div className="flex items-center justify-end gap-1 text-sm">
                                      <p>{`${t("Fine due date")}:`}</p>
                                      <p>{formatDate(fine.expiryAt)}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
