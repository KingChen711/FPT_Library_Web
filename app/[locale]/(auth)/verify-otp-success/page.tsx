import Link from "next/link"
import { routing } from "@/i18n/routing"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

function VerificationOtpSuccessPage() {
  return (
    <div className="flex w-1/3 flex-col items-center justify-center gap-6 overflow-hidden">
      <div className="container space-y-4 rounded-lg border-2 bg-white p-8 shadow-2xl">
        <h1 className="text-center font-semibold">Verification</h1>
        <p className="text-center text-xl font-semibold text-gray-400">
          Thank you
        </p>
        <p className="text-center font-semibold text-gray-400">
          You are verified successfully
        </p>
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center rounded-full bg-green-600 p-4">
            <Check className="size-24" color="white" />
          </div>
        </div>
        <Button variant={"primary"} className="w-full">
          <Link href="/en/login">Login</Link>
        </Button>
      </div>
    </div>
  )
}

export default VerificationOtpSuccessPage
