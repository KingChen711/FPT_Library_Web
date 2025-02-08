import React from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { auth } from "@/queries/auth"
import getTracking from "@/queries/trackings/get-tracking"
import getTrackingDetails from "@/queries/trackings/get-tracking-details"
import { format } from "date-fns"
import { Check, X } from "lucide-react"
import { getLocale } from "next-intl/server"

import { getFormatLocale } from "@/lib/get-format-locale"
import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"
import { cn, formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Copitor from "@/components/ui/copitor"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import NoData from "@/components/ui/no-data"
import ParseHtml from "@/components/ui/parse-html"
import Rating from "@/components/ui/rating"
import ShelfBadge from "@/components/ui/shelf-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TrackingStatusBadge from "@/components/ui/tracking-status-badge"
import TrackingTypeBadge from "@/components/ui/tracking-type-badge"
import TrainedBadge from "@/components/ui/trained-badge"

import TrackingActionsDropdown from "./_components/tracking-actions-dropdown"
import TrackingDetailBreadCrumb from "./_components/tracking-detail-bread-crumb"
import TrackingDetailsSection from "./_components/tracking-details-section"

type Props = {
  params: {
    id: string
  }
}

async function TrackingDetailPage({ params }: Props) {
  await auth().protect(EFeature.LIBRARY_ITEM_MANAGEMENT)

  const t = await getTranslations("TrackingsManagementPage")
  const locale = await getLocale()
  const formatLocale = await getFormatLocale()

  const tracking = await getTracking(+params.id)
  const trackingDetails = await getTrackingDetails(+params.id)

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
          <h3 className="mx-5 text-lg font-semibold">{t("Summary")}</h3>
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
                <p>
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
                </p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Actual return date")}</h4>
              <div className="flex gap-2">
                <p>
                  {tracking.actualReturnDate ? (
                    format(new Date(tracking.actualReturnDate), "dd MMM yyyy", {
                      locale: formatLocale,
                    })
                  ) : (
                    <NoData />
                  )}
                </p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3 lg:border-r">
              <h4 className="font-bold">{t("Transfer location")}</h4>
              <div className="flex gap-2">
                <p>{tracking.transferLocation || <NoData />}</p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 md:border-r lg:col-span-3">
              <h4 className="font-bold">{t("Description")}</h4>
              <div className="flex gap-2">
                <p>{tracking.description || <NoData />}</p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Created at")}</h4>
              <div className="flex gap-2">
                <p>
                  {tracking.createdAt ? (
                    format(new Date(tracking.createdAt), "dd MMM yyyy", {
                      locale: formatLocale,
                    })
                  ) : (
                    <NoData />
                  )}
                </p>
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
                <p>
                  {tracking.updatedAt ? (
                    format(new Date(tracking.updatedAt), "dd MMM yyyy", {
                      locale: formatLocale,
                    })
                  ) : (
                    <NoData />
                  )}
                </p>
              </div>
            </div>

            <div className="col-span-12 flex flex-col gap-1 border-0 px-5 md:col-span-6 lg:col-span-3">
              <h4 className="font-bold">{t("Updated by")}</h4>
              <div className="flex gap-2">
                <p>{tracking.updatedBy || <NoData />}</p>
              </div>
            </div>
          </div>
        </div>

        <TrackingDetailsSection
          trackingDetails={trackingDetails}
          trackingId={tracking.trackingId}
        />
      </div>
    </div>
  )
}

export default TrackingDetailPage
