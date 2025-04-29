import React from "react"
import { auth } from "@/queries/auth"
import getClosureDays from "@/queries/closure-days/get-closure-days"

import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"

import ClosureDayList from "./_components/closure-day-list"

type Props = {
  searchParams: {
    search?: string
  }
}

async function ClosureDaysManagementPage({ searchParams }: Props) {
  const search = searchParams?.search || ""
  await auth().protect(EFeature.SYSTEM_CONFIGURATION_MANAGEMENT)
  const t = await getTranslations("ClosureDaysManagementPage")
  const closureDays = await getClosureDays(search)

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Closure days")}</h3>
      </div>
      <ClosureDayList closureDays={closureDays} />
    </div>
  )
}

export default ClosureDaysManagementPage
