import React from "react"
import { auth } from "@/queries/auth"

import { getTranslations } from "@/lib/get-translations"
import { EFeature } from "@/lib/types/enums"

import CreateNotificationDialog from "./_components/create-notification-dialog"

async function NotificationPage() {
  await auth().protect(EFeature.BORROW_MANAGEMENT)
  const t = await getTranslations("NotificationsManagementPage")
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h3 className="text-2xl font-semibold">{t("Notifications")}</h3>
        <div className="flex items-center gap-x-4">
          <CreateNotificationDialog />
        </div>
      </div>
    </div>
  )
}

export default NotificationPage
