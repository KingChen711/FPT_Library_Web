"use client"

import { useState, useTransition } from "react"
import { useManagementEmployeesStore } from "@/stores/employees/use-management-employees"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { type Employee } from "@/lib/types/models"
import { softDeleteEmployee } from "@/actions/employees/soft-delete"
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

type EmployeeSoftDeleteConfirmProps = {
  openDelete: boolean
  setOpenDelete: (value: boolean) => void
  employee: Employee
}

const EmployeeSoftDeleteConfirm = ({
  employee,
  openDelete,
  setOpenDelete,
}: EmployeeSoftDeleteConfirmProps) => {
  const locale = useLocale()
  const message = `${locale === "vi" ? "xóa" : "delete"}`
  const t = useTranslations("GeneralManagement")
  const [value, setValue] = useState<string>("")
  const { clear } = useManagementEmployeesStore()
  const [pending, startSoftDelete] = useTransition()

  const handleSoftDelete = () => {
    startSoftDelete(async () => {
      const res = await softDeleteEmployee(employee.employeeId)
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
            {pending && <Loader2 className="ml-2 size-4 animate-spin" />}
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

export default EmployeeSoftDeleteConfirm
