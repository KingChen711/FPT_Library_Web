import { notFound } from "next/navigation"
import getBorrowRecordPatron from "@/queries/borrows/get-borrow-record-patron"
import { format } from "date-fns"
import { Check, X } from "lucide-react"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import NoData from "@/components/ui/no-data"
import BorrowTypeBadge from "@/components/badges/borrow-type-bade"
import BorrowHistory from "@/app/[locale]/management/(borrow-and-return)/borrows/records/[id]/components/borrow-history"

import BorrowRecordFineDialog from "./_components/borrow-record-fine-dialog"

type Props = {
  params: { borrowRecordId: number }
}

async function BorrowRecordDetailPage({ params }: Props) {
  const id = Number(params.borrowRecordId)
  if (!id) notFound()

  const record = await getBorrowRecordPatron(id)

  if (!record) notFound()

  const formatLocale = await getFormatLocale()

  const title = `${record.librarycard.fullName} - ${format(
    record.borrowDate,
    "dd MMM yyyy",
    {
      locale: formatLocale,
    }
  )}`

  const t = await getTranslations("BorrowAndReturnManagementPage")

  return (
    <div className="pb-8">
      <div className="flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/me/account/borrow">
                {t("Borrow records")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">{title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-2">
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-semibold">{title}</h3>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-md border py-5">
          <div className="flex items-center justify-between gap-4 px-5">
            <h3 className="text-lg font-semibold">{t("Borrow information")}</h3>
          </div>
          <div className="grid grid-cols-12 gap-y-6 text-sm">
            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Borrow date")}</h4>
              <div className="flex items-center gap-2">
                {record.borrowDate ? (
                  <p>
                    {format(record.borrowDate, "dd MMM yyyy", {
                      locale: formatLocale,
                    })}
                  </p>
                ) : (
                  <NoData />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Borrow type")}</h4>
              <div className="flex gap-2">
                <BorrowTypeBadge status={record.borrowType} />
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Total record items")}</h4>
              <div className="flex gap-2">{record.totalRecordItem}</div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Has fine to payment")}</h4>
              <div className="flex gap-2">
                {record.hasFineToPayment ? (
                  <Check className="text-success" />
                ) : (
                  <X className="text-danger" />
                )}
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Process by")}</h4>
              <div className="flex items-center gap-2">
                {record.processedByNavigation.email}
              </div>
            </div>
          </div>
        </div>

        <BorrowHistory
          borrowRecord={record}
          actions={
            <BorrowRecordFineDialog
              borrowRecordId={record.borrowRecordId}
              fines={record.borrowRecordDetails
                .map((d) =>
                  d.fines.map((f) => ({
                    ...f,
                    itemName: d.libraryItem.title,
                    image: d.libraryItem.coverImage,
                  }))
                )
                .flat()}
              single={false}
              hasFineToPayment={record.hasFineToPayment}
            />
          }
        />
      </div>
    </div>
  )
}

export default BorrowRecordDetailPage
