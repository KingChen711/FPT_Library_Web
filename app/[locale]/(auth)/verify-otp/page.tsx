import Image from "next/image"
import FptLogo from "@/public/assets/images/fpt-logo.png"

import VerifyOtpForm from "../_components/verify-otp-form"

function VerificationOtpPage() {
  return (
    <div className="flex w-[420px] max-w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg bg-background shadow-lg">
      <div className="container space-y-4 rounded-lg border-2 p-8 shadow-2xl">
        <div className="flex justify-center">
          <Image src={FptLogo.src} alt="Logo" width={120} height={48} />
        </div>
        <div className="flex flex-col gap-y-1">
          <h1 className="text-center text-lg font-semibold">Verification</h1>
          <p className="text-center text-sm text-muted-foreground">
            Check your email for OTP
          </p>
        </div>
        <VerifyOtpForm />
      </div>
    </div>
  )
}

export default VerificationOtpPage
