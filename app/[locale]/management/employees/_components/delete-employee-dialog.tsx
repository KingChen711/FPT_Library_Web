import { useState, useTransition } from "react"
import { useManagementEmployeesStore } from "@/stores/employees/use-management-employees"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
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

type Props = {
  openDelete: boolean
  setOpenDelete: (value: boolean) => void
  fineName: string
  fineId: number
}

function DeleteEmployeeDialog({
  setOpenDelete,
  openDelete,
  fineName,
  fineId,
}: Props) {
  const locale = useLocale()
  const message = `${locale === "vi" ? "xóa" : "delete"} ${fineName}`
  const t = useTranslations("GeneralManagement")
  const [value, setValue] = useState("")
  const { clear } = useManagementEmployeesStore()
  const [pending, startTransition] = useTransition()

  const handleDeleteEmployee = () => {
    startTransition(async () => {
      const res = await deleteEmployee(fineId.toString())

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
          <DialogTitle className="mb-1">{t("Delete fine")}</DialogTitle>
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
              onChange={(e) => setValue(e.target.value)}
              className="mt-2"
            />
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4">
          <Button
            onClick={handleDeleteEmployee}
            disabled={value !== message || pending}
            className="flex-1"
          >
            {t("btn.delete")}
            {pending && <Loader2 className="ml-2 size-4" />}
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              setOpenDelete(false)
            }}
            variant="secondary"
          >
            {t("btn.cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteEmployeeDialog
