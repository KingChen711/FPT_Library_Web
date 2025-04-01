import React from "react"
import Image from "next/image"
import systemLogo from "@/public/images/logo.png"

import { getTranslations } from "@/lib/get-translations"

import LoginOtpForm from "./_components/login-otp-form"

type Props = {
  params: {
    email: string
  }
}

async function LoginOtpMethodPage({ params }: Props) {
  const t = await getTranslations("LoginPage.OtpMethodPage")
  const email = decodeURIComponent(params.email).trim()
  return (
    <div className="flex w-[420px] max-w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-md bg-card shadow-lg">
      <div className="container space-y-4 rounded-md border-2 p-8 shadow-2xl">
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
            {t("Check your email")}
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            {t("Message")}
          </p>
          <p className="text-center text-sm text-muted-foreground">{email}</p>
        </div>
        <LoginOtpForm email={email} />
      </div>
    </div>
  )
}

export default LoginOtpMethodPage
