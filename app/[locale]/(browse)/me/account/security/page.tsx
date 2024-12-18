import React from "react"
import { auth } from "@/queries/auth"
import getBackupCodes from "@/queries/auth/get-backup-codes"
import getMfaQr, { type TMfaQr } from "@/queries/auth/get-mfa-qr"

import { getTranslations } from "@/lib/get-translations"
import BackupCodes from "@/components/ui/backup-codes"
import { Label } from "@/components/ui/label"

import ActiveMfaButton from "./_components/active-mfa-button"
import GenerateNewCodesButton from "./_components/generate-new-codes-button"

async function SecurityPage() {
  const { protect, whoAmI } = auth()

  await protect()

  const t = await getTranslations("SecurityPage")
  const { backupCodes, hasActiveMfa } = await getBackupCodes()
  let mfaQr: TMfaQr | null = null

  if (!hasActiveMfa) {
    const currentUser = await whoAmI()

    if (!currentUser) {
      throw new Error("Unexpected error")
    }
    mfaQr = await getMfaQr(currentUser.email)

    if (!mfaQr) {
      throw new Error("Unexpected error")
    }
  }

  return (
    <div className="flex flex-col gap-y-6 md:px-2">
      {!hasActiveMfa && (
        <>
          <div className="flex flex-col gap-y-2">
            <Label>{t("MFA")}</Label>

            <ActiveMfaButton mfaQr={mfaQr!} />
          </div>
        </>
      )}
      {hasActiveMfa && (
        <>
          <div className="flex flex-col gap-y-2">
            <Label>{t("Backup code")}</Label>
            <BackupCodes className="my-1 justify-start" codes={backupCodes} />
            <GenerateNewCodesButton />
          </div>
        </>
      )}
    </div>
  )
}

export default SecurityPage
