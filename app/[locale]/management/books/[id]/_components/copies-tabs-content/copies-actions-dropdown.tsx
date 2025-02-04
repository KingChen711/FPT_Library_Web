import React, { useState, useTransition } from "react"
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Trash2,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { EBookCopyStatus } from "@/lib/types/enums"
import { type LibraryItemInstance } from "@/lib/types/models"
import { changeCopiesStatus } from "@/actions/books/editions/change-copies-status"
import { deleteCopies } from "@/actions/books/editions/delete-copies"
import { moveToTrashCopies } from "@/actions/books/editions/move-to-trash-copies"
import { restoreCopies } from "@/actions/books/editions/restore-copies"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import DeleteDialog from "../delete-dialog"
import MoveToTrashDialog from "../move-to-trash-dialog"

type Props = {
  selectedCopyIds: number[]
  setSelectedCopyIds: (val: number[]) => void
  bookId: number
  tab: "Active" | "Deleted"
  copies: LibraryItemInstance[]
}

function CopiesActionsDropdown({
  tab,
  selectedCopyIds,
  setSelectedCopyIds,
  bookId,
  copies,
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

  const handleChangeCopiesStatus = (status: EBookCopyStatus) => {
    if (isPending) return
    console.log(status)

    const updatedCopies = copies
      .filter((c) => selectedCopyIds.includes(c.libraryItemInstanceId))
      .map((c) => {
        c.status = status
        return c
      })

    startTransition(async () => {
      const res = await changeCopiesStatus({
        bookEditionCopies: updatedCopies,
        bookId,
      })

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setSelectedCopyIds([])
        setOpenDropdown(false)
        return
      }

      handleServerActionError(res, locale)
    })
  }

  const handleMoveToTrash = () => {
    if (isPending) return

    startTransition(async () => {
      const res = await moveToTrashCopies({
        ids: selectedCopyIds,

        bookId,
      })

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setSelectedCopyIds([])
        setOpenDropdown(false)
        return
      }

      handleServerActionError(res, locale)
    })
  }

  const handleRestore = () => {
    if (isPending) return

    startTransition(async () => {
      const res = await restoreCopies({
        ids: selectedCopyIds,

        bookId,
      })

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setSelectedCopyIds([])
        setOpenDropdown(false)
        return
      }

      handleServerActionError(res, locale)
    })
  }

  const handleDelete = () => {
    if (isPending) return

    startTransition(async () => {
      const res = await deleteCopies({
        ids: selectedCopyIds,

        bookId,
      })

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setSelectedCopyIds([])
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
                onClick={() =>
                  handleChangeCopiesStatus(EBookCopyStatus.IN_SHELF)
                }
                className="cursor-pointer"
              >
                <ArrowUp />
                {t("Put on shelf")}
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled={isPending}
                onClick={() =>
                  handleChangeCopiesStatus(EBookCopyStatus.OUT_OF_SHELF)
                }
                className="cursor-pointer"
              >
                <ArrowDown />
                {t("Remove on shelf")}
              </DropdownMenuItem>
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

export default CopiesActionsDropdown
