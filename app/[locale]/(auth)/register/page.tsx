import { routing } from "@/i18n/routing"

import RegisterForm from "../_components/register-form"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

function RegisterPage() {
  return (
    <div className="flex w-1/3 flex-col items-center justify-center gap-6 overflow-hidden">
      <div className="container space-y-2 rounded-lg border-2 bg-white p-8">
        <h1 className="text-center font-semibold">Registration</h1>
        <p className="text-center text-gray-400">For Both staff & Students</p>
        <RegisterForm />
      </div>
    </div>
  )
}

export default RegisterPage
