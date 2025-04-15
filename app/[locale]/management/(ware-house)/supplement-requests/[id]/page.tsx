import React from "react"
import { notFound } from "next/navigation"
import { auth } from "@/queries/auth"
import { getConditions } from "@/queries/conditions/get-conditions"
import getTracking from "@/queries/trackings/get-tracking"
import { format } from "date-fns"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { formatPrice } from "@/lib/utils"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Copitor from "@/components/ui/copitor"
import NoData from "@/components/ui/no-data"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TrackingStatusBadge from "@/components/badges/tracking-status-badge"
import TrackingTypeBadge from "@/components/badges/tracking-type-badge"

import TrackingActionsDropdown from "../../trackings/[id]/_components/tracking-actions-dropdown"
import RecommendTabsContent from "./_components/recommend-tabs-content"
import TrackingDetailsTabsContent from "./_components/tracking-details-tabs-content"

type Props = {
  params: {
    id: string
  }
  searchParams: Record<string, string | string[] | undefined>
}

async function SupplementRequestDetailPage({ params }: Props) {
  await auth().protect(EFeature.LIBRARY_ITEM_MANAGEMENT)

  const t = await getTranslations("TrackingsManagementPage")

  const formatLocale = await getFormatLocale()

  const supplementRequest = await getTracking(+params.id)

  if (!supplementRequest) notFound()

  const conditions = await getConditions()

  return (
    <div className="mt-4 pb-8">
      <div className="flex flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/management/supplement-requests">
                {t("Supplement requests")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">
                {supplementRequest.receiptNumber}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-2">
          <div className="flex w-full flex-wrap items-center justify-between gap-4">
            <h3 className="text-2xl font-semibold">
              {supplementRequest.receiptNumber}
            </h3>
            <TrackingActionsDropdown
              supplementRequest
              tracking={supplementRequest}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-md border py-5">
          <h3 className="mx-5 text-lg font-semibold">{t("Information")}</h3>
          <div className="grid grid-cols-12 gap-y-6 text-sm">
            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Receipt number")}</h4>
              <div className="flex gap-2">
                <Copitor content={supplementRequest.receiptNumber} />
                <p>{supplementRequest.receiptNumber}</p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Data finalization date")}</h4>
              <div className="flex gap-2">
                {supplementRequest.dataFinalizationDate ? (
                  format(
                    new Date(supplementRequest.dataFinalizationDate),
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

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Total item")}</h4>
              <div className="flex gap-2">
                <p>{supplementRequest.totalItem}</p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Total amount")}</h4>
              <div className="flex gap-2">
                <p>{formatPrice(supplementRequest.totalAmount)}</p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Tracking type")}</h4>
              <div className="flex gap-2">
                <TrackingTypeBadge type={supplementRequest.trackingType} />
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Status")}</h4>
              <div className="flex gap-2">
                <TrackingStatusBadge status={supplementRequest.status} />
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Entry date")}</h4>
              <div className="flex gap-2">
                <p>
                  {format(
                    new Date(supplementRequest.entryDate),
                    "dd MMM yyyy",
                    {
                      locale: formatLocale,
                    }
                  )}
                </p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Expected return date")}</h4>
              <div className="flex gap-2">
                <div>
                  {supplementRequest.expectedReturnDate ? (
                    format(
                      new Date(supplementRequest.expectedReturnDate),
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
                  {supplementRequest.actualReturnDate ? (
                    format(
                      new Date(supplementRequest.actualReturnDate),
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

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Transfer location")}</h4>
              <div className="flex gap-2">
                <div>{supplementRequest.transferLocation || <NoData />}</div>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Description")}</h4>
              <div className="flex gap-2">
                <div>{supplementRequest.description || <NoData />}</div>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Created at")}</h4>
              <div className="flex gap-2">
                <div>
                  {supplementRequest.createdAt ? (
                    format(
                      new Date(supplementRequest.createdAt),
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
              <h4 className="font-bold">{t("Created by")}</h4>
              <div className="flex gap-2">
                <p>{supplementRequest.createdBy || <NoData />}</p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Updated at")}</h4>
              <div className="flex gap-2">
                <div>
                  {supplementRequest.updatedAt ? (
                    format(
                      new Date(supplementRequest.updatedAt),
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

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Updated by")}</h4>
              <div className="flex gap-2">
                <div>{supplementRequest.updatedBy || <NoData />}</div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="tracking-details">
          <TabsList>
            <TabsTrigger value="tracking-details">
              {t("Tracking details")}
            </TabsTrigger>
            <TabsTrigger value="recommended">
              {t("Recommended by AI")}
            </TabsTrigger>
          </TabsList>

          <TrackingDetailsTabsContent
            conditions={conditions}
            trackingId={supplementRequest.trackingId}
          />

          <RecommendTabsContent trackingId={supplementRequest.trackingId} />
        </Tabs>
      </div>
    </div>
  )
}

export default SupplementRequestDetailPage
