"use client"

import { useEffect, useState, useTransition } from "react"
import { Loader2, Trash } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { softDeleteRangeEmployee } from "@/actions/employees/soft-delete-range-employee"
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

type EmployeeSoftDeleteConfirmProps = {
  selectedIds: string[]
}

const EmployeeSoftDeleteRangeConfirm = ({
  selectedIds,
}: EmployeeSoftDeleteConfirmProps) => {
  const locale = useLocale()
  const message = `${locale === "vi" ? "Chuyển vào thùng rác" : "move to trash"}`
  const t = useTranslations("CategoriesManagementPage")
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
      const res = await softDeleteRangeEmployee(selectedIds)
      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Move to trash successfully",
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
          <Trash /> Move items to trash
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-1">Move to trash</DialogTitle>
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

export default EmployeeSoftDeleteRangeConfirm
