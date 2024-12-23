"use client"

import { useState, useTransition } from "react"
import { MoreHorizontal, Trash, Trash2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { type Author } from "@/lib/types/models"
import { type TAuthorDialogSchema } from "@/lib/validations/author/author-dialog"
import { undoDeleteAuthor } from "@/actions/authors/undo-delete"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import AuthorDialogForm from "../author-dialog"
import AuthorDeleteConfirm from "./author-delete-confirm"
import AuthorSoftDeleteConfirm from "./author-soft-delete-confirm"

type AuthorActionProps = {
  author: Author
}

const AuthorAction = ({ author }: AuthorActionProps) => {
  const locale = useLocale()
  const tGeneralManagement = useTranslations("GeneralManagement")

  const [pendingUndoDelete, startUndoDelete] = useTransition()

  const [openDelete, setOpenDelete] = useState(false)
  const [openSoftDelete, setOpenSoftDelete] = useState(false)

  const [updatingAuthor] = useState<TAuthorDialogSchema>(() => ({
    authorCode: author.authorCode,
    fullName: author.fullName,
    dob: author.dob,
    dateOfDeath: author.dateOfDeath,
    nationality: author.nationality,
    biography: author.biography,
    authorImage: author.authorImage,
  }))

  if (!author) return null

  const handleUndoDelete = () => {
    startUndoDelete(async () => {
      const res = await undoDeleteAuthor(author.authorId.toString())
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Undo delete successfully",
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
                <AuthorDialogForm
                  mode="update"
                  author={updatingAuthor}
                  authorId={author.authorId.toString()}
                />
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setOpenSoftDelete(true)}
              >
                <Trash /> {tGeneralManagement("move to trash")}
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleUndoDelete}
                disabled={pendingUndoDelete}
              >
                <Trash /> {tGeneralManagement("undo delete")}
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => setOpenDelete(true)}
              >
                <Trash2 /> {tGeneralManagement("delete permanently")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default AuthorAction
