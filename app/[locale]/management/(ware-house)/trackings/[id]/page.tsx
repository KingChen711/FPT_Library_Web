import React, { Suspense } from "react"
import { notFound } from "next/navigation"
import { auth } from "@/queries/auth"
import { getConditions } from "@/queries/conditions/get-conditions"
import getTracking from "@/queries/trackings/get-tracking"
import getTrackingDetails from "@/queries/trackings/get-tracking-details"
import { format } from "date-fns"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { formatPrice } from "@/lib/utils"
import { searchTrackingDetailsSchema } from "@/lib/validations/trackings/search-tracking-details"
import Copitor from "@/components/ui/copitor"
import NoData from "@/components/ui/no-data"
import TrackingStatusBadge from "@/components/badges/tracking-status-badge"
import TrackingTypeBadge from "@/components/badges/tracking-type-badge"

import TrackingActionsDropdown from "./_components/tracking-actions-dropdown"
import TrackingDetailBreadCrumb from "./_components/tracking-detail-bread-crumb"
import TrackingDetailsSection, {
  TrackingDetailsSectionSkeleton,
} from "./_components/tracking-details-section"

type Props = {
  params: {
    id: string
  }
  searchParams: Record<string, string | string[] | undefined>
}

async function TrackingDetailPage({ params, searchParams }: Props) {
  await auth().protect(EFeature.LIBRARY_ITEM_MANAGEMENT)

  const t = await getTranslations("TrackingsManagementPage")

  const formatLocale = await getFormatLocale()

  const tracking = await getTracking(+params.id)

  const conditions = await getConditions()

  const parsedSearchParams = searchTrackingDetailsSchema.parse(searchParams)

  const {
    result: { sources: trackingDetails, totalPage, totalActualItem },
    statisticSummary,
  } = await getTrackingDetails(+params.id, parsedSearchParams)

  if (!tracking) notFound()

  return (
    <div className="mt-4 pb-8">
      <div className="flex flex-col gap-4">
        <TrackingDetailBreadCrumb title={tracking.receiptNumber} />

        <div className="flex flex-col gap-2">
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <h3 className="text-2xl font-semibold">{tracking.receiptNumber}</h3>
            <TrackingActionsDropdown tracking={tracking} />
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-md border py-5">
          <h3 className="mx-5 text-lg font-semibold">{t("Information")}</h3>
          <div className="grid grid-cols-12 gap-y-6 text-sm">
            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Receipt number")}</h4>
              <div className="flex gap-2">
                <Copitor content={tracking.receiptNumber} />
                <p>{tracking.receiptNumber}</p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Supplier")}</h4>
              <div className="flex gap-2">
                <Copitor content={tracking.supplier.supplierName} />
                <p>{tracking.supplier.supplierName}</p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Total item")}</h4>
              <div className="flex gap-2">
                <p>{tracking.totalItem}</p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Total amount")}</h4>
              <div className="flex gap-2">
                <p>{formatPrice(tracking.totalAmount)}</p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Tracking type")}</h4>
              <div className="flex gap-2">
                <TrackingTypeBadge type={tracking.trackingType} />
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Status")}</h4>
              <div className="flex gap-2">
                <TrackingStatusBadge status={tracking.status} />
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Entry date")}</h4>
              <div className="flex gap-2">
                <p>
                  {format(new Date(tracking.entryDate), "dd MMM yyyy", {
                    locale: formatLocale,
                  })}
                </p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Expected return date")}</h4>
              <div className="flex gap-2">
                <div>
                  {tracking.expectedReturnDate ? (
                    format(
                      new Date(tracking.expectedReturnDate),
                      "dd MMM yyyy",
                      {
                        locale: formatLocale,
                      }
                    )
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Actual return date")}</h4>
              <div className="flex gap-2">
                <div>
                  {tracking.actualReturnDate ? (
                    format(new Date(tracking.actualReturnDate), "dd MMM yyyy", {
                      locale: formatLocale,
                    })
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Transfer location")}</h4>
              <div className="flex gap-2">
                <div>{tracking.transferLocation || <NoData />}</div>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Description")}</h4>
              <div className="flex gap-2">
                <div>{tracking.description || <NoData />}</div>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Created at")}</h4>
              <div className="flex gap-2">
                <div>
                  {tracking.createdAt ? (
                    format(new Date(tracking.createdAt), "dd MMM yyyy", {
                      locale: formatLocale,
                    })
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Created by")}</h4>
              <div className="flex gap-2">
                <p>{tracking.createdBy || <NoData />}</p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Updated at")}</h4>
              <div className="flex gap-2">
                <div>
                  {tracking.updatedAt ? (
                    format(new Date(tracking.updatedAt), "dd MMM yyyy", {
                      locale: formatLocale,
                    })
                  ) : (
                    <NoData />
                  )}
                </div>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Updated by")}</h4>
              <div className="flex gap-2">
                <div>{tracking.updatedBy || <NoData />}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-md border py-5">
          <h3 className="mx-5 text-lg font-semibold">{t("Statistic")}</h3>
          <div className="grid grid-cols-12 gap-y-6 text-sm">
            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Total library item")}</h4>
              <div className="flex gap-2">
                <p>{statisticSummary.totalItem}</p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Total instance")}</h4>
              <div className="flex gap-2">
                <p>{statisticSummary.totalInstanceItem}</p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Total cataloged item")}</h4>
              <div className="flex gap-2">
                <p>{statisticSummary.totalCatalogedItem}</p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Total cataloged instance")}</h4>
              <div className="flex gap-2">
                <p>{statisticSummary.totalCatalogedInstanceItem}</p>
              </div>
            </div>
          </div>
        </div>

        <Suspense fallback={<TrackingDetailsSectionSkeleton />}>
          <TrackingDetailsSection
            totalActualItem={totalActualItem}
            totalPage={totalPage}
            searchParams={parsedSearchParams}
            conditions={conditions}
            trackingDetails={trackingDetails}
            trackingId={tracking.trackingId}
            trackingType={tracking.trackingType}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default TrackingDetailPage
