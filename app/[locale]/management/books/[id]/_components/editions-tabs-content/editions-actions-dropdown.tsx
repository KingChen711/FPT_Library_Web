import React, { useState, useTransition } from "react"
import { ChevronDown, ChevronUp, RotateCcw, Trash2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { moveToTrashBookEditions } from "@/actions/books/editions/move-to-trash-book-editions"
import { restoreEditions } from "@/actions/books/editions/restore-editions"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import MoveToTrashDialog from "../move-to-trash-dialog"

type Props = {
  selectedEditionIds: number[]
  setSelectedEditionIds: (val: number[]) => void

  tab: "Active" | "Deleted"
}

function EditionsActionsDropdown({
  tab,
  selectedEditionIds,
  setSelectedEditionIds,
}: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()
  const [openDropdown, setOpenDropdown] = useState(false)
  const [openMoveTrash, setOpenMoveTrash] = useState(false)

  const [isPending, startTransition] = useTransition()

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpenDropdown(value)
  }

  const handleMoveToTrash = () => {
    if (isPending) return
    startTransition(async () => {
      const res = await moveToTrashBookEditions(selectedEditionIds)
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setSelectedEditionIds([])
        setOpenDropdown(false)
        return
      }
      handleServerActionError(res, locale)
    })
  }

  const handleRestore = () => {
    if (isPending) return
    startTransition(async () => {
      const res = await restoreEditions(selectedEditionIds)
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setSelectedEditionIds([])
        setOpenDropdown(false)
        return
      }
      handleServerActionError(res, locale)
    })
  }

  return (
    <>
      <MoveToTrashDialog
        handleMoveToTrash={handleMoveToTrash}
        isPending={isPending}
        open={openMoveTrash}
        setOpen={setOpenMoveTrash}
      />

      <DropdownMenu open={openDropdown} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {t("Actions")} {openDropdown ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {tab === "Active" ? (
            <>
              <DropdownMenuItem
                disabled={isPending}
                onClick={() => setOpenMoveTrash(true)}
                className="cursor-pointer"
              >
                <Trash2 />
                {t("Move to trash")}
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem
                disabled={isPending}
                onClick={handleRestore}
                className="cursor-pointer"
              >
                <RotateCcw />
                {t("Restore")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default EditionsActionsDropdown
