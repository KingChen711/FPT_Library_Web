"use client"

import React, { useTransition } from "react"
import { useManagementBookEditionsStore } from "@/stores/books/use-management-book-editions"
import { Loader2, RotateCcw, Trash2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { moveToTrashBookEditions } from "@/actions/books/editions/move-to-trash-book-editions"
import { restoreEditions } from "@/actions/books/editions/restore-editions"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"

type Props = {
  tab: "Active" | "Deleted"
}

function MoveTrashBookEditionsButton({ tab }: Props) {
  const { selectedIds, clear } = useManagementBookEditionsStore()
  const t = useTranslations("BooksManagementPage")
  const [pending, startTransition] = useTransition()
  const locale = useLocale()

  const handleMoveToTrashBooks = () => {
    startTransition(async () => {
      const res = await moveToTrashBookEditions(selectedIds)

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

  const handleRestoreEditions = () => {
    startTransition(async () => {
      const res = await restoreEditions(selectedIds)

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
    <>
      {tab === "Active" ? (
        <Button
          disabled={pending}
          onClick={handleMoveToTrashBooks}
          variant="destructive"
        >
          <Trash2 /> {t("Move to trash")}
          {pending && <Loader2 className="size-4 animate-spin" />}
        </Button>
      ) : (
        <Button disabled={pending} onClick={handleRestoreEditions}>
          <RotateCcw /> {t("Restore")}
          {pending && <Loader2 className="size-4 animate-spin" />}
        </Button>
      )}
    </>
  )
}

export default MoveTrashBookEditionsButton
