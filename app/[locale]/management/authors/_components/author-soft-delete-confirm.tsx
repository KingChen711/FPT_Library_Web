"use client"

import { useState, useTransition } from "react"
import { useManagementAuthorsStore } from "@/stores/authors/use-management-authors"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { type Author } from "@/lib/types/models"
import { softDeleteAuthor } from "@/actions/authors/soft-delete"
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

const AuthorSoftDeleteConfirm = ({
  author: author,
  openDelete,
  setOpenDelete,
}: Props) => {
  const locale = useLocale()
  const message = `${author.fullName}`
  const t = useTranslations("GeneralManagement")
  const [value, setValue] = useState<string>("")
  const [pending, startSoftDelete] = useTransition()
  const { clear } = useManagementAuthorsStore()

  const handleSoftDelete = () => {
    startSoftDelete(async () => {
      const res = await softDeleteAuthor(author.authorId)
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        clear()
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
          <DialogTitle className="mb-1">{t("move to trash")}</DialogTitle>
          <DialogDescription>
            <div
              className="select-none"
              dangerouslySetInnerHTML={{
                __html: t.markup("type to confirm", {
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
            onClick={handleSoftDelete}
            className="flex-1"
            disabled={value !== message || pending}
          >
            {t("btn.delete")}
            {pending && <Loader2 className="ml-2 size-4" />}
          </Button>
          <Button
            className="flex-1"
            variant="secondary"
            onClick={() => setOpenDelete(false)}
          >
            {t("btn.cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AuthorSoftDeleteConfirm
