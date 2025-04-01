import React from "react"
import Image from "next/image"
import { routing } from "@/i18n/routing"
import systemLogo from "@/public/images/logo.png"
import { setRequestLocale } from "next-intl/server"

import { getTranslations } from "@/lib/get-translations"

import LoginForm from "../_components/login-form"

type Props = {
  params: { locale: string }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

async function LoginPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const t = await getTranslations("LoginPage")
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
            {t("Welcome back!")}
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            {t("Message")}
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage
