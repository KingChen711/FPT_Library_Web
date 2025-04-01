import Image from "next/image"
import systemLogo from "@/public/images/logo.png"

import { getTranslations } from "@/lib/get-translations"

import MfaForm from "../../_components/mfa-form"

type Props = {
  params: {
    email: string
  }
}

const MfaPage = async ({ params }: Props) => {
  const email = decodeURIComponent(params.email).trim()
  const t = await getTranslations("MfaPage")
  return (
    <div className="flex w-[420px] max-w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-md bg-background shadow-lg">
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
            {t("Verify MFA")}
          </h1>
          <p className="text-center text-sm text-muted-foreground">
            {t("Message")}
          </p>
        </div>
        <MfaForm email={email} validatePage />
      </div>
    </div>
  )
}

export default MfaPage
