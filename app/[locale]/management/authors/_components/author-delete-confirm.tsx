"use client"

import { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { type Author } from "@/lib/types/models"
import { deleteAuthor } from "@/actions/authors/delete-author"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type Props = {
  openDelete: boolean
  setOpenDelete: (value: boolean) => void
  author: Author
}

const AuthorDeleteConfirm = ({
  author: author,
  openDelete,
  setOpenDelete,
}: Props) => {
  const locale = useLocale()
  const message = `${locale === "vi" ? "xóa" : "delete"} ${author.fullName}`
  const tGeneralManagement = useTranslations("GeneralManagement")
  const tAuthorManagement = useTranslations("AuthorManagement")
  const [value, setValue] = useState<string>("")

  const [pending, startDelete] = useTransition()

  const handleDelete = () => {
    startDelete(async () => {
      const res = await deleteAuthor(author.authorId)
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setOpenDelete(false)
        return
      }
      handleServerActionError(res, locale)
    })
  }

  return (
    <Dialog open={openDelete} onOpenChange={setOpenDelete}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-1">
            {tAuthorManagement("delete employee")}
          </DialogTitle>
          <DialogDescription>
            <div
              className="select-none"
              dangerouslySetInnerHTML={{
                __html: tGeneralManagement.markup("type to confirm", {
                  message: () => `<strong>${message}</strong>`,
                }),
              }}
            ></div>
            <Input
              value={value}
              className="mt-2"
              onChange={(e) => setValue(e.target.value)}
            />
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4">
          <Button
            onClick={handleDelete}
            className="flex-1"
            disabled={value !== message || pending}
          >
            {tGeneralManagement("btn.delete")}
            {pending && <Loader2 className="ml-2 size-4" />}
          </Button>
          <Button
            className="flex-1"
            variant="secondary"
            onClick={() => setOpenDelete(false)}
          >
            {tGeneralManagement("btn.cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AuthorDeleteConfirm
