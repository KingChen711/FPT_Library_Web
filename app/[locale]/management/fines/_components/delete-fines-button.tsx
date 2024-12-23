"use client"

import React, { useTransition } from "react"
import { useManagementFinesStore } from "@/stores/fines/use-management-fines"
import { Loader2, Trash2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { deleteFines } from "@/actions/fines/delete-fines"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

function DeleteFinesButton() {
  const { selectedIds, clear } = useManagementFinesStore()
  const t = useTranslations("FinesManagementPage")
  const [pending, startTransition] = useTransition()
  const locale = useLocale()

  const handleDeleteFines = () => {
    startTransition(async () => {
      const res = await deleteFines(selectedIds)

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        clear()
        return
      }

      handleServerActionError(res, locale)
    })
  }

  if (selectedIds.length === 0) return null

  return (
    <Button
      disabled={pending}
      onClick={handleDeleteFines}
      variant="destructive"
    >
      <Trash2 /> {t("Delete")}{" "}
      {pending && <Loader2 className="size-4 animate-spin" />}
    </Button>
  )
}

export default DeleteFinesButton
