import getBorrowSettings from "@/queries/borrows/get-borrow-settings"
import getFines from "@/queries/fines/get-fines"

import { getTranslations } from "@/lib/get-translations"
import { formatPrice } from "@/lib/utils"
import { searchFinesSchema } from "@/lib/validations/fines/search-fines"
import NoResult from "@/components/ui/no-result"
import Paginator from "@/components/ui/paginator"
import SortableTableHead from "@/components/ui/sortable-table-head"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import FineTypeBadge from "@/components/badges/fine-type-badge"

type Props = {
  searchParams: {
    search?: string
    pageIndex?: string
    pageSize?: string
    sort?: string
  }
}

const PolicyPage = async ({ searchParams }: Props) => {
  // Get fines
  const t = await getTranslations("FinesManagementPage")
  const tBorrow = await getTranslations("BorrowAndReturnManagementPage")
  const { search, pageIndex, sort, pageSize } =
    searchFinesSchema.parse(searchParams)
  const {
    sources: fines,
    totalActualItem,
    totalPage,
  } = await getFines({ search, pageIndex, sort, pageSize })

  // Get borrow settings
  const borrowSettings = await getBorrowSettings()

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <h3 className="text-2xl font-semibold">
            {tBorrow("BorrowSettings")}
          </h3>
        </div>

        {borrowSettings && (
          <div className="grid grid-cols-12 gap-y-6 rounded-md border py-6 text-sm">
            <section className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{tBorrow("pickUpExpirationInDays")}</h4>
              <div className="flex items-center gap-2">
                {borrowSettings.pickUpExpirationInDays} {tBorrow("days")}
              </div>
            </section>
            <section className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{tBorrow("extendPickUpInDays")}</h4>
              <div className="flex items-center gap-2">
                {borrowSettings.extendPickUpInDays} {tBorrow("days")}
              </div>
            </section>
            <section className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{tBorrow("borrowAmountOnceTime")}</h4>
              <div className="flex items-center gap-2">
                {borrowSettings.borrowAmountOnceTime} {tBorrow("resources")}
              </div>
            </section>
            <section className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{tBorrow("totalMissedPickUpAllow")}</h4>
              <div className="flex items-center gap-2">
                {borrowSettings.totalMissedPickUpAllow} {tBorrow("times")}
              </div>
            </section>
            <section className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{tBorrow("maxBorrowExtension")}</h4>
              <div className="flex items-center gap-2">
                {borrowSettings.maxBorrowExtension} {tBorrow("times")}
              </div>
            </section>
            <section className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{tBorrow("allowToExtendInDays")}</h4>
              <div className="flex items-center gap-2">
                {borrowSettings.allowToExtendInDays} {tBorrow("days")}
              </div>
            </section>
            <section className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{tBorrow("fineExpirationInDays")}</h4>
              <div className="flex items-center gap-2">
                {borrowSettings.fineExpirationInDays} {tBorrow("days")}
              </div>
            </section>
            <section className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">
                {tBorrow("lostAmountPercentagePerDay")}
              </h4>
              <div className="flex items-center gap-2">
                {borrowSettings.lostAmountPercentagePerDay}
              </div>
            </section>
          </div>
        )}
      </div>

      <div>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
          <h3 className="text-2xl font-semibold">{t("Fines")}</h3>
        </div>

        {fines.length === 0 ? (
          <div className="flex justify-center p-4">
            <NoResult
              title={t("Fines Not Found")}
              description={t(
                "No fines matching your request were found Please check your information or try searching with different criteria"
              )}
            />
          </div>
        ) : (
          <div className="mt-4 grid w-full">
            <div className="overflow-x-auto rounded-md border">
              <Table className="overflow-hidden">
                <TableHeader>
                  <TableRow>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Title")}
                      sortKey="FinePolicyTitle"
                    />
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Condition type")}
                      sortKey="ConditionType"
                      position="center"
                    />
                    <TableHead className="text-nowrap font-bold">
                      {t("Description")}
                    </TableHead>
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Charge pct")}
                      sortKey="ChargePct"
                    />
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Processing fee")}
                      sortKey="ProcessingFee"
                    />
                    <SortableTableHead
                      currentSort={sort}
                      label={t("Daily rate")}
                      sortKey="DailyRate"
                    />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fines.map((fine) => (
                    <TableRow key={fine.finePolicyId}>
                      <TableCell className="text-nowrap">
                        {fine.finePolicyTitle}
                      </TableCell>
                      <TableCell className="text-nowrap">
                        <div className="flex justify-center">
                          <FineTypeBadge type={fine.conditionType} />
                        </div>
                      </TableCell>
                      <TableCell className="text-nowrap">
                        {fine.description}
                      </TableCell>
                      <TableCell className="text-nowrap">
                        {fine.chargePct
                          ? Math.floor(fine.chargePct * 100) + "%"
                          : "-"}
                      </TableCell>
                      <TableCell className="text-nowrap">
                        {fine.processingFee
                          ? formatPrice(fine.processingFee)
                          : "-"}
                      </TableCell>
                      <TableCell className="text-nowrap">
                        {fine.dailyRate ? formatPrice(fine.dailyRate) : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
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
        )}
      </div>
    </div>
  )
}

export default PolicyPage
