import React from "react"
import { auth } from "@/queries/auth"

import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"

import CreateTrackingDialog from "./_components/create-tracking-dialog"

async function WarehouseTrackingsManagementPage() {
  await auth().protect(EFeature.WAREHOUSE_TRACKING_MANAGEMENT)
  const t = await getTranslations("TrackingsManagementPage")

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Warehouse trackings")}</h3>
        <div className="flex items-center gap-x-4">
          <CreateTrackingDialog />
        </div>
      </div>
    </div>
  )
}

export default WarehouseTrackingsManagementPage
