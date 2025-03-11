import React from "react"

import { getTranslations } from "@/lib/get-translations"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type Props = {
  title: string
  addTrackingDetail?: boolean
  trackingId?: number
}

async function TrackingDetailBreadCrumb({
  title,
  addTrackingDetail = false,
  trackingId,
}: Props) {
  const t = await getTranslations("TrackingsManagementPage")
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/management/trackings">
            {t("Trackings")}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {addTrackingDetail && trackingId ? (
          <BreadcrumbLink href={`/management/trackings/${trackingId}`}>
            {title}
          </BreadcrumbLink>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbPage className="line-clamp-1">{title}</BreadcrumbPage>
          </BreadcrumbItem>
        )}

        <BreadcrumbSeparator />
        {addTrackingDetail && (
          <BreadcrumbItem>
            <BreadcrumbPage className="line-clamp-1">
              {t("Add tracking detail")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export default TrackingDetailBreadCrumb
