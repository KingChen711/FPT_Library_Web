import React from "react"
import { notFound } from "next/navigation"
import { auth } from "@/queries/auth"
import getTracking from "@/queries/trackings/get-tracking"

import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"

import TrackingDetailBreadCrumb from "../_components/tracking-detail-bread-crumb"
import AddTrackingDetailForm from "./_components/add-tracking-detail-form"

type Props = {
  params: {
    id: string
  }
}

async function AddNewTrackingDetails({ params }: Props) {
  await auth().protect(EFeature.LIBRARY_ITEM_MANAGEMENT)
  const tracking = await getTracking(+params.id)

  if (!tracking) notFound()

  const t = await getTranslations("TrackingsManagementPage")

  return (
    <>
      <div className="flex flex-col gap-4">
        <TrackingDetailBreadCrumb
          title={tracking.receiptNumber}
          addTrackingDetail
          trackingId={+params.id}
        />

        <div className="space-y-0">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
            <h3 className="text-2xl font-semibold">
              {t("Add tracking detail")}
            </h3>
          </div>
          <AddTrackingDetailForm trackingId={+params.id} />
        </div>
      </div>
    </>
  )
}

export default AddNewTrackingDetails
