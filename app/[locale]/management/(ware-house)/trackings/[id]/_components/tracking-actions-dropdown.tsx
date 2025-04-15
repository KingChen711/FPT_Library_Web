"use client"

import React, { useState, useTransition } from "react"
import { useAuth } from "@/contexts/auth-provider"
import { type TTrackingDetail } from "@/queries/trackings/get-tracking"
import {
  Check,
  ChevronDown,
  ChevronUp,
  FileUp,
  Loader2,
  Pencil,
  Trash2,
  X,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { ETrackingStatus } from "@/lib/types/enums"
import { addFinalizedStockInFile } from "@/actions/trackings/add-finalized-stock-in-file"
import { addFinalizedSupplementRequestFile } from "@/actions/trackings/add-finalized-supplement-request-file"
import { changeTrackingStatus } from "@/actions/trackings/change-tracking-status"
import { getExportRecommendAI } from "@/actions/trackings/get-export-recommend-ai"
import { getExportTrackingDetails } from "@/actions/trackings/get-export-tracking-details"
import useUploadImage from "@/hooks/media/use-upload-image"
import { type TAIRecommends } from "@/hooks/trackings/use-ai-recommends"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icons } from "@/components/ui/icons"

import ConfirmExportFileDialog from "./confirm-export-file-dialog"
import DeleteTrackingDialog from "./delete-tracking-dialog"
import EditTrackingDialog from "./edit-tracking-dialog"
import { generatePDF } from "./generate-pdf/generate-pdf"

type Props = {
  tracking: TTrackingDetail
  supplementRequest?: boolean
}

function TrackingActionsDropdown({
  tracking,
  supplementRequest = false,
}: Props) {
  const t = useTranslations("TrackingsManagementPage")
  const locale = useLocale()
  const [openDropdown, setOpenDropdown] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openExport, setOpenExport] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [exporting, startExport] = useTransition()
  const { user } = useAuth()
  const { mutateAsync: uploadBookImage } = useUploadImage()

  const handleChangeStatus = (status: ETrackingStatus) => {
    startTransition(async () => {
      const res = await changeTrackingStatus(tracking.trackingId, status)
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setOpenDropdown(false)
        return
      }
      handleServerActionError(res, locale)
    })
  }

  const handleExport = () => {
    startExport(async () => {
      const [trackingDetailsData, recommendItems] = await Promise.all([
        getExportTrackingDetails(tracking.trackingId),
        supplementRequest
          ? getExportRecommendAI(tracking.trackingId)
          : ({
              sources: [],
              pageIndex: 1,
              pageSize: 10,
              totalActualItem: 0,
              totalPage: 0,
            } as TAIRecommends),
      ])
      if (!trackingDetailsData) {
        toast({
          title: locale === "vi" ? "Lỗi" : "Failed",
          description: locale === "vi" ? "Lỗi không xác định" : "Unknown error",
          variant: "danger",
        })
        return
      }

      const {
        result: { sources: trackingDetails },
        statistics,
        statisticSummary,
      } = trackingDetailsData

      try {
        const { pdf, url } = generatePDF({
          statistics,
          tracking,
          trackingDetails,
          statisticSummary,
          supplementRequest,
          recommendItems,
        })

        const data = await uploadBookImage(pdf)
        if (!data) {
          throw new Error("")
        }

        const res = supplementRequest
          ? await addFinalizedSupplementRequestFile(
              tracking.trackingId,
              data.secureUrl
            )
          : await addFinalizedStockInFile(tracking.trackingId, data.secureUrl)

        if (res.isSuccess) {
          toast({
            title: locale === "vi" ? "Thành công" : "Success",
            description: res.data,
            variant: "success",
          })
          window.open(url)
          return
        }

        handleServerActionError(res, locale)
      } catch {
        toast({
          title: locale === "vi" ? "Lỗi" : "Failed",
          description: locale === "vi" ? "Lỗi không xác định" : "Unknown error",
          variant: "danger",
        })
      }
    })
  }

  const handleOpenChange = (value: boolean) => {
    if (isPending || exporting) return
    setOpenDropdown(value)
  }

  return (
    <>
      <ConfirmExportFileDialog
        open={openExport}
        setOpen={setOpenExport}
        isPending={exporting}
        onExportFile={handleExport}
        receipt={tracking.receiptNumber}
        supplementRequest
      />
      <EditTrackingDialog
        open={openEdit}
        setOpen={setOpenEdit}
        tracking={tracking}
      />

      <DeleteTrackingDialog
        title={tracking.receiptNumber}
        open={openDelete}
        setOpen={setOpenDelete}
        trackingId={tracking.trackingId}
      />

      <DropdownMenu open={openDropdown} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {t("Actions")} {openDropdown ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="overflow-visible">
          {/* ! TODO:hardcode */}

          {user?.role.englishName === "HeadLibrarian" && (
            <>
              {tracking.status === ETrackingStatus.PROCESSING && (
                <>
                  <DropdownMenuItem
                    disabled={isPending || exporting}
                    className="cursor-pointer"
                    onClick={() =>
                      handleChangeStatus(ETrackingStatus.COMPLETED)
                    }
                  >
                    {isPending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Check className="size-4" />
                    )}
                    {t("Completed")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={isPending || exporting}
                    className="cursor-pointer"
                    onClick={() =>
                      handleChangeStatus(ETrackingStatus.CANCELLED)
                    }
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

              {tracking.status === ETrackingStatus.COMPLETED && (
                <>
                  <DropdownMenuItem
                    disabled={isPending || exporting}
                    className="cursor-pointer"
                    onClick={() =>
                      handleChangeStatus(ETrackingStatus.PROCESSING)
                    }
                  >
                    <Icons.Draft />
                    {t("Change to draft")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={isPending || exporting}
                    className="cursor-pointer"
                    onClick={() => setOpenExport(true)}
                  >
                    {exporting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <FileUp className="size-4" />
                    )}
                    {supplementRequest
                      ? t("Export file supplement request")
                      : t("Export file")}
                  </DropdownMenuItem>
                </>
              )}
            </>
          )}

          <DropdownMenuItem
            disabled={isPending || exporting}
            className="cursor-pointer"
            onClick={() => {
              setOpenDropdown(false)
              setOpenEdit(true)
            }}
          >
            <Pencil />
            {t("Edit information")}
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isPending || exporting}
            className="cursor-pointer"
            onClick={() => {
              setOpenDropdown(false)
              setOpenDelete(true)
            }}
          >
            <Trash2 />
            {t("Delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default TrackingActionsDropdown
