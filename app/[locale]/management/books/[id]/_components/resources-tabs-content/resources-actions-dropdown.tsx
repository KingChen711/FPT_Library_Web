import React, { useState, useTransition } from "react"
import { ChevronDown, ChevronUp, RotateCcw, Trash2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { deleteResources } from "@/actions/books/delete-resources"
import { moveToTrashResources } from "@/actions/books/move-to-trash-resources"
import { restoreResources } from "@/actions/books/restore-resources"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import DeleteDialog from "../../../../_components/delete-dialog"
import MoveToTrashDialog from "../../../../_components/move-to-trash-dialog"

type Props = {
  selectedResourceIds: number[]
  setSelectedResourceIds: (val: number[]) => void
  bookId: number

  tab: "Active" | "Deleted"
}

function ResourcesActionsDropdown({
  tab,
  selectedResourceIds,
  setSelectedResourceIds,
  bookId,
}: Props) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()
  const [openDropdown, setOpenDropdown] = useState(false)
  const [openMoveTrash, setOpenMoveTrash] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const [isPending, startTransition] = useTransition()

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpenDropdown(value)
  }

  const handleMoveToTrash = () => {
    if (isPending) return

    startTransition(async () => {
      const res = await moveToTrashResources({
        ids: selectedResourceIds,
        bookId,
      })

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setSelectedResourceIds([])
        setOpenDropdown(false)
        return
      }

      handleServerActionError(res, locale)
    })
  }

  const handleRestore = () => {
    if (isPending) return

    startTransition(async () => {
      const res = await restoreResources({
        ids: selectedResourceIds,
        bookId,
      })

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setSelectedResourceIds([])
        setOpenDropdown(false)
        return
      }

      handleServerActionError(res, locale)
    })
  }

  const handleDelete = () => {
    if (isPending) return

    startTransition(async () => {
      const res = await deleteResources({
        ids: selectedResourceIds,
        bookId,
      })

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setSelectedResourceIds([])
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
      <DeleteDialog
        handleDelete={handleDelete}
        isPending={isPending}
        open={openDelete}
        setOpen={setOpenDelete}
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
              <DropdownMenuItem
                disabled={isPending}
                onClick={() => {
                  setOpenDelete(true)
                }}
                className="cursor-pointer"
              >
                <Trash2 />
                {t("Delete permanently")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default ResourcesActionsDropdown
