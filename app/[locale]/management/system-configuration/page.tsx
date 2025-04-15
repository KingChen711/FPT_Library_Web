import React from "react"
import { notFound } from "next/navigation"
import getSystemConfiguration from "@/queries/system/get-system-configuration"
import { getTranslations } from "next-intl/server"

import ConfigurationTabs from "./_components/configuration-tabs"

async function SystemConfigurationPage() {
  const t = await getTranslations("SystemConfiguration")

  const systemConfiguration = await getSystemConfiguration()

  if (!systemConfiguration) notFound()

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("System configuration")}</h3>
      </div>

      <ConfigurationTabs systemConfiguration={systemConfiguration} />
    </div>
  )
}

export default SystemConfigurationPage
