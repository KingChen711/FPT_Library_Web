import React, { useState } from "react"
import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Props = {
  isPending: boolean
  onApplyLabel: () => void
  amount: number
}

function ConfirmApplyDialog({ amount, isPending, onApplyLabel }: Props) {
  const t = useTranslations("BorrowAndReturnManagementPage")
  const tZod = useTranslations("Zod")
  const [value, setValue] = useState("")
  const [open, setOpen] = useState(false)
  const [error, setError] = useState("")

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }

  const handelApplyLabel = () => {
    if (!value) {
      setError("min1")
      return
    }

    if (!Number(+value)) {
      setError("invalid")
      return
    }

    if (Number(+value) < amount) {
      setError("lessThanRequire")
      return
    }

    if (Number(+value) > amount) {
      setError("greaterThanRequire")
      return
    }

    onApplyLabel()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          {t("Confirm apply label")}
          {isPending && <Loader2 className="ml-1 size-4 animate-spin" />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-2">
          <Label>{t("How many labels have you applied")}</Label>
          <Input
            disabled={isPending}
            type="number"
            value={value}
            onChange={(e) => {
              setError("")
              setValue(e.target.value)
            }}
          />
          {error && <p className="text-sm text-danger">{tZod(error)}</p>}

          <div className="flex justify-end gap-4">
            <Button disabled={isPending} onClick={handelApplyLabel}>
              {t("Confirm")}
              {isPending && <Loader2 className="ml-1 size-4 animate-spin" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmApplyDialog
