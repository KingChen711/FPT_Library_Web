import Image from "next/image"
import { notFound } from "next/navigation"
import fptLogo from "@/public/assets/images/fpt-logo.png"

import { getTranslations } from "@/lib/get-translations"

import ResetPasswordForm from "../../../_components/reset-password-form"

type Props = {
  params: {
    email: string
    type: "user" | "employee"
  }
}

const ResetPasswordPage = async ({ params }: Props) => {
  const email = decodeURIComponent(params.email).trim()

  if (!["user", "employee"].includes(params.type)) {
    notFound()
  }

  const t = await getTranslations("ResetPasswordPage")
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
            {t("Reset password")}
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            {t("Message")}
          </p>
          <p className="text-center text-sm text-muted-foreground">{email}</p>
        </div>
        <ResetPasswordForm type={params.type} email={email} />
      </div>
    </div>
  )
}

export default ResetPasswordPage
