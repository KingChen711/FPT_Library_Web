import React, { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { deleteSupplier } from "@/actions/suppliers/delete-supplier"
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
  supplierName: string
  supplierId: number
}

function DeleteSupplierDialog({
  setOpenDelete,
  openDelete,
  supplierName,
  supplierId,
}: Props) {
  const locale = useLocale()
  const message = `${locale === "vi" ? "xóa" : "delete"} ${supplierName}`
  const t = useTranslations("SuppliersManagementPage")
  const [value, setValue] = useState("")

  const [pending, startTransition] = useTransition()

  const handleDeleteSupplier = () => {
    startTransition(async () => {
      const res = await deleteSupplier(supplierId)
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
          <DialogTitle className="mb-1">{t("Delete supplier")}</DialogTitle>
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
            onClick={handleDeleteSupplier}
            disabled={value !== message || pending}
            className="flex-1"
          >
            {t("Delete")}
            {pending && <Loader2 className="ml-2 size-4 animate-spin" />}
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              setOpenDelete(false)
            }}
            variant="secondary"
          >
            {t("Cancel")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteSupplierDialog
