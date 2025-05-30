"use client"

import { useState, useTransition } from "react"
import { useManagementEmployeesStore } from "@/stores/employees/use-management-employees"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { type Employee } from "@/lib/types/models"
import { deleteEmployee } from "@/actions/employees/delete-employee"
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

type EmployeeDeleteConfirmProps = {
  openDelete: boolean
  setOpenDelete: (value: boolean) => void
  employee: Employee
}

const EmployeeDeleteConfirm = ({
  employee,
  openDelete,
  setOpenDelete,
}: EmployeeDeleteConfirmProps) => {
  const locale = useLocale()
  const message = `${locale === "vi" ? "xóa" : "delete"}`
  const tGeneralManagement = useTranslations("GeneralManagement")
  const EmployeeManagement = useTranslations("EmployeeManagement")
  const [value, setValue] = useState<string>("")
  const { clear } = useManagementEmployeesStore()
  const [pending, startDelete] = useTransition()

  const handleDelete = () => {
    startDelete(async () => {
      const res = await deleteEmployee(employee.employeeId)
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
          <DialogTitle className="mb-1">
            {EmployeeManagement("delete employee")}
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
            {pending && <Loader2 className="ml-2 size-4 animate-spin" />}
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

export default EmployeeDeleteConfirm
