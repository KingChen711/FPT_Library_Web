"use client"

import React, { useTransition } from "react"
import { useAuth } from "@/contexts/auth-provider"
import { Check, Loader2, X } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { ETrackingStatus } from "@/lib/types/enums"
import { changeTrackingStatus } from "@/actions/trackings/change-tracking-status"
import { toast } from "@/hooks/use-toast"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/ui/icons"

type Props = {
  status: ETrackingStatus
  trackingId: number
  supplementRequest: boolean
}

function UpdateTrackingStatusDropdownItem({
  status,
  trackingId,
  supplementRequest,
}: Props) {
  const [isPending, startTransition] = useTransition()
  const { user } = useAuth()
  const locale = useLocale()
  const t = useTranslations("TrackingsManagementPage")

  const handleChangeStatus = (status: ETrackingStatus) => {
    startTransition(async () => {
      const res = await changeTrackingStatus(
        trackingId,
        status,
        supplementRequest
      )
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })

        return
      }
      handleServerActionError(res, locale)
    })
  }

  return (
    <>
      {user?.role.englishName === "HeadLibrarian" && (
        <>
          {status === ETrackingStatus.PROCESSING && (
            <>
              <DropdownMenuItem
                disabled={isPending}
                className="cursor-pointer"
                onClick={() => handleChangeStatus(ETrackingStatus.COMPLETED)}
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Check className="size-4" />
                )}
                {t("Completed")}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isPending}
                className="cursor-pointer"
                onClick={() => handleChangeStatus(ETrackingStatus.CANCELLED)}
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <X className="size-4" />
                )}
                {t("Cancelled")}
              </DropdownMenuItem>
            </>
          )}

          {status === ETrackingStatus.COMPLETED && (
            <>
              <DropdownMenuItem
                disabled={isPending}
                className="cursor-pointer"
                onClick={() => handleChangeStatus(ETrackingStatus.PROCESSING)}
              >
                <Icons.Draft />
                {t("Change to draft")}
              </DropdownMenuItem>
            </>
          )}
        </>
      )}
    </>
  )
}

export default UpdateTrackingStatusDropdownItem
