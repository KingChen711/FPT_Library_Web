"use client"

import { useState, useTransition } from "react"
import { MoreHorizontal, SquarePen, Trash, Trash2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { type Author } from "@/lib/types/models"
import { undoDeleteAuthor } from "@/actions/authors/undo-delete"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import AuthorDeleteConfirm from "./author-delete-confirm"
import AuthorSoftDeleteConfirm from "./author-soft-delete-confirm"
import MutateAuthorDialog from "./mutate-author-dialog"

type Props = {
  author: Author
}

function AuthorActionDropdown({ author }: Props) {
  const t = useTranslations("GeneralManagement")

  const locale = useLocale()
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [openSoftDelete, setOpenSoftDelete] = useState(false)

  const [pendingUndoDelete, startUndoDelete] = useTransition()

  const handleUndoDelete = () => {
    startUndoDelete(async () => {
      const res = await undoDeleteAuthor(author.authorId)
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
      <AuthorDeleteConfirm
        author={author}
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
      />
      <AuthorSoftDeleteConfirm
        author={author}
        openDelete={openSoftDelete}
        setOpenDelete={setOpenSoftDelete}
      />
      <MutateAuthorDialog
        type="update"
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
        author={author}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex size-8 w-full justify-center p-0"
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-primary-foreground">
          {!author?.isDeleted ? (
            <>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <DropdownMenuItem className="cursor-pointer">
                  <div
                    onClick={() => {
                      setOpenEdit(true)
                    }}
                    className="flex items-center gap-x-2"
                  >
                    <SquarePen className="size-4" />
                    {t("btn.update")}
                  </div>
                </DropdownMenuItem>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setOpenSoftDelete(true)}
              >
                <Trash /> {t("move to trash")}
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleUndoDelete}
                disabled={pendingUndoDelete}
              >
                <Trash /> {t("undo delete")}
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setOpenDelete(true)}
              >
                <Trash2 /> {t("delete permanently")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default AuthorActionDropdown
