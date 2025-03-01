import Image from "next/image"
import systemLogo from "@/public/images/logo.png"
import getMfaQr from "@/queries/auth/get-mfa-qr"

import { getTranslations } from "@/lib/get-translations"

import MfaForm from "../../../_components/mfa-form"
import BackupCodes from "../../../../../../components/ui/backup-codes"

type Props = {
  params: {
    email: string
  }
}

const MfaPage = async ({ params }: Props) => {
  const email = decodeURIComponent(params.email).trim()
  const t = await getTranslations("MfaPage")
  const data = await getMfaQr(email)

  if (!data) {
    throw new Error("something went wrong")
  }

  return (
    <div className="flex w-[420px] max-w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg bg-background shadow-lg">
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
            {t("Active MFA")}
          </h1>
          <div className="flex gap-x-4">
            <div className="flex aspect-square size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              1
            </div>
            <p className="text-left text-sm text-muted-foreground">
              {t("Message enable")}
            </p>
          </div>
          <div className="mt-3 flex flex-col">
            <div className="flex gap-x-4">
              <div className="flex aspect-square size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                2
              </div>
              <p className="text-left text-sm text-muted-foreground">
                {t("Message enable 2")}
              </p>
            </div>
            <div className="mt-3 flex justify-center">
              <Image
                src={data.qrCodeImage}
                alt="qr-code"
                width={180}
                height={180}
              />
            </div>
          </div>
          <div className="mt-3 flex flex-col">
            <div className="flex gap-x-4">
              <div className="flex aspect-square size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                3
              </div>
              <p className="text-left text-sm text-muted-foreground">
                {t("Message enable 3")}
              </p>
            </div>
            <BackupCodes codes={data.backupCodes} />
          </div>
          <div className="mt-3 flex flex-col">
            <div className="flex items-center gap-x-4">
              <div className="flex aspect-square size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                4
              </div>
              <p className="text-left text-sm text-muted-foreground">
                {t("Message enable 4")}
              </p>
            </div>
            <MfaForm email={email} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default MfaPage
