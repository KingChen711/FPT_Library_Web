import React from "react"
import { auth } from "@/queries/auth"

import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"

import CreateTrackingImportForm from "./_components/create-trackinng-import"

async function CreateTrackingImport() {
  await auth().protect(EFeature.WAREHOUSE_TRACKING_MANAGEMENT)

  const t = await getTranslations("TrackingsManagementPage")

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Create tracking")}</h3>
      </div>
      <CreateTrackingImportForm />
    </div>
  )
}

export default CreateTrackingImport
