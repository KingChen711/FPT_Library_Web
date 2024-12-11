import Image from "next/image"
import { routing } from "@/i18n/routing"
import fptLogo from "@/public/assets/images/fpt-logo.png"
import { setRequestLocale } from "next-intl/server"

import { getTranslations } from "@/lib/get-translations"

import RegisterForm from "../_components/register-form"

type Props = {
  params: { locale: string }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

async function RegisterPage({ params: { locale } }: Props) {
  setRequestLocale(locale)
  const t = await getTranslations("RegisterPage")
  return (
    <div className="flex w-[420px] max-w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg bg-background shadow-lg">
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
            {t("Create your account")}
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            {t("Message")}
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}

export default RegisterPage
