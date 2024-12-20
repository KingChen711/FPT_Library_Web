"use client"

import React, { useState, useTransition } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useLocalStorage } from "usehooks-ts"

import handleServerActionError from "@/lib/handle-server-action-error"
import { isTokenExpired } from "@/lib/utils"
import { confirmNewBackupCodes } from "@/actions/auth/confirm-new-backup-codes"
import useRequestNewBackupCodes from "@/hooks/auth/use-request-new-backup-codes"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function GenerateNewCodesButton() {
  const t = useTranslations("SecurityPage")
  const [open, setOpen] = useState(false)
  const { mutate: requestNewCodes } = useRequestNewBackupCodes()
  const [isPending, startTransition] = useTransition()
  const [token, setToken] = useLocalStorage("backup-codes-token", "")
  const [otp, setOtp] = useLocalStorage("backup-codes-otp", "")
  const locale = useLocale()

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpen(value)
  }

  const handleConfirmNewCodes = () => {
    startTransition(async () => {
      const res = await confirmNewBackupCodes(otp, token)

      if (res.isSuccess) {
        toast({
          title: locale === "vi" ? "Thành công" : "Success",
          description: res.data,
          variant: "success",
        })
        setOpen(false)
        return
      }

      handleServerActionError(res, locale)
    })
  }

  return (
    <>
      <Button
        className="w-fit"
        onClick={() => {
          if (!token || !otp || isTokenExpired(token)) {
            setToken("")
            setOtp("")
            requestNewCodes(undefined, {
              onSuccess: setToken,
            })
            setOpen(true)
            return
          }

          handleConfirmNewCodes()
        }}
      >
        {t("Generate new codes")}
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="w-[420px]">
          <DialogHeader>
            <DialogTitle className="mb-1">{t("Need to verify")}</DialogTitle>
            <DialogDescription>
              <Label>{t("Verify code")}</Label>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mt-2"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {t("Check your email for verification code")}
              </p>
              <div className="mt-2 flex gap-4">
                <Button onClick={handleConfirmNewCodes} className="flex-1">
                  {t("Continue")}
                </Button>
                <DialogClose asChild>
                  <Button variant="outline" className="flex-1">
                    {t("Cancel")}
                  </Button>
                </DialogClose>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default GenerateNewCodesButton
