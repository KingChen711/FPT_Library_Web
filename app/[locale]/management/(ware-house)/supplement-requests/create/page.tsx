import React from "react"
import { auth } from "@/queries/auth"

import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"

import CreateStockRequestForm from "./_components/create-stock-request-form"

async function CreateStockRequest() {
  await auth().protect(EFeature.WAREHOUSE_TRACKING_MANAGEMENT)

  const t = await getTranslations("TrackingsManagementPage")

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">
          {t("Create supplement request")}
        </h3>
      </div>
      <CreateStockRequestForm />
    </div>
  )
}

export default CreateStockRequest
