import React from "react"
import Image from "next/image"
import fptLogo from "@/public/assets/images/fpt-logo.png"

import { getTranslations } from "@/lib/get-translations"

import LoginPasswordForm from "./_component/login-password-form"

type Props = {
  params: {
    email: string
  }
}

async function LoginPasswordMethodPage({ params }: Props) {
  const t = await getTranslations("LoginPage.PasswordMethodPage")
  const email = decodeURIComponent(params.email)
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
            {t("Enter your password")}
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            {t("Message")}
          </p>
          <p className="text-center text-sm text-muted-foreground">{email}</p>
        </div>
        <LoginPasswordForm email={email} />
      </div>
    </div>
  )
}

export default LoginPasswordMethodPage
