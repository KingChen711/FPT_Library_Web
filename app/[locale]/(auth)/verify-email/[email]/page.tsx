import Image from "next/image"
import systemLogo from "@/public/assets/images/logo.png"

import { getTranslations } from "@/lib/get-translations"

import VerifyEmailForm from "../../_components/verify-email-form"

type Props = {
  params: {
    email: string
  }
}

const VerifyEmailPage = async ({ params }: Props) => {
  const email = decodeURIComponent(params.email).trim()
  const t = await getTranslations("VerifyEmailPage")
  return (
    <div className="flex w-[420px] max-w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg bg-background shadow-lg">
      <div className="container space-y-4 rounded-lg border-2 p-8 shadow-2xl">
        <div className="flex flex-col items-center justify-center">
          <Image
            src={systemLogo}
            placeholder="blur"
            priority
            alt="Logo"
            width={72}
            height={72}
          />
          <div className="text-sm font-bold">Intelligent Library</div>
        </div>
        <div className="flex flex-col gap-y-1">
          <h1 className="text-center text-lg font-semibold">
            {t("Verify your email")}
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            {t("Message")}
          </p>
          <p className="text-center text-sm text-muted-foreground">{email}</p>
        </div>
        <VerifyEmailForm email={email} />
      </div>
    </div>
  )
}

export default VerifyEmailPage
