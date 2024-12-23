"use client"

import { useEffect, useState, useTransition } from "react"
import { Loader2, RotateCw } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { undoDeleteRangeEmployee } from "@/actions/employees/undo-delete-range-employee"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

type Props = {
  selectedIds: string[]
}

const EmployeeUndoDeleteRangeConfirm = ({ selectedIds }: Props) => {
  const locale = useLocale()
  const message = `${locale === "vi" ? "khôi phục" : "undo delete"}`
  const t = useTranslations("GeneralManagement")
  const [value, setValue] = useState<string>("")
  const [isOpen, setIsOpen] = useState(false)
  const [pending, startDelete] = useTransition()

  useEffect(() => {
    if (isOpen) {
      setValue("")
    }
  }, [isOpen])

  const handleSubmit = () => {
    startDelete(async () => {
      const res = await undoDeleteRangeEmployee(selectedIds)
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Undo delete successfully",
          description: res.data,
          variant: "success",
        })
        setIsOpen(false)
        return
      }
      handleServerActionError(res, locale)
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild>
        <DialogTrigger>
          <RotateCw /> {t("undo delete")}
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-1">{t("undo delete")}</DialogTitle>
          <DialogDescription>
            <div
              className="select-none"
              dangerouslySetInnerHTML={{
                __html: t.markup("type to confirm", {
                  message: () => `<strong>${message}</strong>`,
                }),
              }}
            />
            <Input
              value={value}
              className="mt-2"
              onChange={(e) => setValue(e.target.value)}
            />
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4">
          <Button
            onClick={handleSubmit}
            className="flex-1"
            disabled={value !== message || pending}
          >
            {t("Delete")}
            {pending && <Loader2 className="ml-2 size-4" />}
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => {
              setIsOpen(false)
              setValue("")
            }}
          >
            {t("Cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EmployeeUndoDeleteRangeConfirm
