import Image from "next/image"
import { routing } from "@/i18n/routing"
import FptLogo from "@/public/images/fpt-logo.png"

import VerifyOtpForm from "../_components/verify-otp-form"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

function VerificationOtpPage() {
  return (
    <div className="flex w-1/3 flex-col items-center justify-center gap-6 overflow-hidden">
      <div className="container space-y-2 rounded-lg border-2 bg-white p-8 shadow-2xl">
        <div className="flex justify-center">
          <Image src={FptLogo.src} alt="Logo" width={160} height={20} />
        </div>
        <h1 className="text-center font-semibold">Verification</h1>
        <p className="text-center text-gray-400">Check your Email for OTP</p>
        <VerifyOtpForm />
      </div>
    </div>
  )
}

export default VerificationOtpPage
