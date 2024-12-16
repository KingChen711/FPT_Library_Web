import React from "react"
import Image from "next/image"
import fptLogo from "@/public/assets/images/fpt-logo.png"

import { getTranslations } from "@/lib/get-translations"

import RecoveryMfaForm from "../../../_components/recovery-mfa-form"

type Props = {
  params: { email: string }
}

async function RecoveryMfaPage({ params }: Props) {
  const email = decodeURIComponent(params.email).trim()
  const t = await getTranslations("RecoveryMfaPage")
  return (
    <div className="flex w-[420px] max-w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg bg-card shadow-lg">
      <div className="container space-y-4 rounded-lg border-2 p-8 shadow-2xl">
        <div className="flex justify-center">
          <Image
            src={fptLogo}
            placeholder="blur"
            priority
            alt="Logo"
            width={120}
            height={48}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <h1 className="text-center text-lg font-semibold">
            {t("Recovery MFA")}
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            {t("Message")}
          </p>
        </div>
        <RecoveryMfaForm email={email} />
      </div>
    </div>
  )
}

export default RecoveryMfaPage
