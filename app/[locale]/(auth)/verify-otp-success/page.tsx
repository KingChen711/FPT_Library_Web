import Image from "next/image"
import { Link } from "@/i18n/routing"
import fptLogo from "@/public/assets/images/fpt-logo.png"

import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"

function VerificationOtpSuccessPage() {
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
          <h1 className="text-center text-lg font-semibold">Verification</h1>
        </div>
        <p className="text-center text-sm font-semibold text-muted-foreground">
          Thank you
        </p>
        <p className="text-center text-sm font-semibold text-muted-foreground">
          You are verified successfully
        </p>
        <div className="flex items-center justify-center py-2">
          <Icons.Check className="size-16 text-primary" color="white" />
        </div>
        <Button className="w-full">
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </div>
  )
}

export default VerificationOtpSuccessPage
