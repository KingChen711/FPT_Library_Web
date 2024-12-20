"use client"

import React, { useState } from "react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-provider"
import { type TMfaQr } from "@/queries/auth/get-mfa-qr"
import { useTranslations } from "next-intl"

import BackupCodes from "@/components/ui/backup-codes"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import MfaForm from "@/app/[locale]/(auth)/_components/mfa-form"

type Props = {
  mfaQr: TMfaQr
}

function ActiveMfaButton({ mfaQr }: Props) {
  const t = useTranslations("MfaPage")
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button className="w-fit" onClick={() => setOpen(true)}>
        {t("Active MFA")}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[420px]">
          <DialogHeader>
            <DialogTitle className="mb-1"> {t("Active MFA")}</DialogTitle>
            <DialogDescription>
              <div className="flex gap-x-4">
                <div className="flex aspect-square size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  1
                </div>
                <p className="text-left text-sm text-muted-foreground">
                  {t("Message enable")}
                </p>
              </div>
              <div className="mt-3 flex flex-col">
                <div className="flex gap-x-4">
                  <div className="flex aspect-square size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    2
                  </div>
                  <p className="text-left text-sm text-muted-foreground">
                    {t("Message enable 2")}
                  </p>
                </div>
                <div className="mt-3 flex justify-center">
                  <Image
                    src={mfaQr.qrCodeImage}
                    alt="qr-code"
                    width={180}
                    height={180}
                  />
                </div>
              </div>
              <div className="mt-3 flex flex-col">
                <div className="flex gap-x-4">
                  <div className="flex aspect-square size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    3
                  </div>
                  <p className="text-left text-sm text-muted-foreground">
                    {t("Message enable 3")}
                  </p>
                </div>
                <BackupCodes codes={mfaQr.backupCodes} />
              </div>
              <div className="mt-3 flex flex-col">
                <div className="flex items-center gap-x-4">
                  <div className="flex aspect-square size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    4
                  </div>
                  <p className="text-left text-sm text-muted-foreground">
                    {t("Message enable 4")}
                  </p>
                </div>
                <MfaForm hideBackToLogin email={user?.email || ""} />
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ActiveMfaButton
