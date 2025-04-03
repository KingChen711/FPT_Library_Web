"use client"

import React, { useState, useTransition } from "react"
import { useManagementAuthorsStore } from "@/stores/authors/use-management-authors"
import { ChevronDown, ChevronUp, RotateCcw, Trash2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { deleteRangeAuthor } from "@/actions/authors/delete-range-author"
import { softDeleteRangeAuthor } from "@/actions/authors/soft-delete-range-author"
import { undoDeleteRangeAuthor } from "@/actions/authors/undo-delete-range-author"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import DeleteDialog from "../../_components/delete-dialog"
import MoveToTrashDialog from "../../_components/move-to-trash-dialog"

type Props = {
  tab: "Active" | "Deleted"
}

function AuthorsActionsDropdown({ tab }: Props) {
  const { selectedIds, clear } = useManagementAuthorsStore()
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()
  // const router = useRouter()
  const [openDropdown, setOpenDropdown] = useState(false)
  const [openMoveTrash, setOpenMoveTrash] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  // const [openGroupCheck, setOpenGroupCheck] = useState(false)
  // const [groupCheckResult, setGroupCheckResult] =
  //   useState<TGroupCheckRes | null>(null)

  const [isPending, startTransition] = useTransition()

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpenDropdown(value)
  }

  const handleMoveToTrash = () => {
    if (isPending) return

    startTransition(async () => {
      const res = await softDeleteRangeAuthor(selectedIds)

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        clear()
        setOpenDropdown(false)
        setOpenMoveTrash(false)
        return
      }

      handleServerActionError(res, locale)
    })
  }

  const handleRestore = () => {
    if (isPending) return

    startTransition(async () => {
      const res = await undoDeleteRangeAuthor(selectedIds)

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        clear()
        setOpenDropdown(false)
        return
      }

      handleServerActionError(res, locale)
    })
  }

  const handleDelete = () => {
    if (isPending) return

    startTransition(async () => {
      const res = await deleteRangeAuthor(selectedIds)

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        clear()
        setOpenDropdown(false)
        setOpenDelete(false)
        return
      }

      handleServerActionError(res, locale)
    })
  }

  // const handleTrain = () => {
  //   if (isPending) return

  //   startTransition(async () => {
  //     if (selectedIds.length === 1) {
  //       router.push(`/management/authors/train-group?itemIds=${selectedIds[0]}`)
  //       return
  //     }

  //     const res = await groupChecks(selectedIds)
  //     if (!res.isSuccess) {
  //       handleServerActionError(res, locale)
  //       return
  //     }

  //     setGroupCheckResult(res.data)
  //     setOpenDropdown(false)
  //     setOpenGroupCheck(true)
  //   })
  // }

  return (
    <>
      {/* <GroupCheckResultDialog
        open={openGroupCheck}
        setOpen={setOpenGroupCheck}
        results={groupCheckResult}
      /> */}
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
          <Button variant="outline" disabled={selectedIds.length === 0}>
            {t("Actions")} {openDropdown ? <ChevronUp /> : <ChevronDown />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/* {isTrained === false && (
            <DropdownMenuItem
              disabled={isPending}
              onClick={handleTrain}
              className="cursor-pointer"
            >
              <Brain />
              Train AI
            </DropdownMenuItem>
          )} */}

          {tab !== "Deleted" ? (
            <DropdownMenuItem
              disabled={isPending}
              onClick={() => setOpenMoveTrash(true)}
              className="cursor-pointer"
            >
              <Trash2 />
              {t("Move to trash")}
            </DropdownMenuItem>
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

export default AuthorsActionsDropdown
