import Image from "next/image"
import { routing } from "@/i18n/routing"
import FptLogo from "@/public/images/fpt-logo.png"

import RegisterForm from "../_components/register-form"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

function RegisterPage() {
  return (
    <div className="flex w-1/3 flex-col items-center justify-center gap-6 overflow-hidden">
      <div className="container rounded-lg border-2 bg-white p-8">
        <div className="flex justify-center">
          <Image src={FptLogo.src} alt="Logo" width={160} height={20} />
        </div>
        <h1 className="text-center text-xl font-semibold">Registration</h1>
        <p className="text-center text-gray-400">For Both staff & Students</p>
        <RegisterForm />
      </div>
    </div>
  )
}

export default RegisterPage
