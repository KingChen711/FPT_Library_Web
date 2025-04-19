import React from "react"
import { auth } from "@/queries/auth"

import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"

import CreateNotificationForm from "./_componenet/create-notification-form"

async function CreateNotificationPage() {
  await auth().protect(EFeature.BORROW_MANAGEMENT)
  const t = await getTranslations("NotificationsManagementPage")

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Create notification")}</h3>
      </div>
      <CreateNotificationForm />
    </div>
  )
}

export default CreateNotificationPage
