import React from "react"
import Image from "next/image"
import systemLogo from "@/public/images/logo.png"

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
        <div className="flex flex-col items-center justify-center">
          <Image
            src={systemLogo}
            placeholder="blur"
            priority
            alt="Logo"
            width={48}
            height={48}
          />
          <div className="text-sm font-bold">Intelligent Library</div>
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
