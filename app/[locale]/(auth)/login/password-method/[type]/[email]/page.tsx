import React from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import systemLogo from "@/public/images/logo.png"

import { getTranslations } from "@/lib/get-translations"

import LoginPasswordForm from "./_components/login-password-form"

type Props = {
  params: {
    email: string
    type: "user" | "admin" | "employee"
  }
}

async function LoginPasswordMethodPage({ params }: Props) {
  const email = decodeURIComponent(params.email).trim()

  if (!["user", "admin", "employee"].includes(params.type)) {
    notFound()
  }

  const t = await getTranslations("LoginPage.PasswordMethodPage")

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
            {t("Enter your password")}
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            {t("Message")}
          </p>
          <p className="text-center text-sm text-muted-foreground">{email}</p>
        </div>
        <LoginPasswordForm email={email} type={params.type} />
      </div>
    </div>
  )
}

export default LoginPasswordMethodPage
