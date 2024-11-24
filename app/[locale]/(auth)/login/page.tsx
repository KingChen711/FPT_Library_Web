import React from "react"
import Image from "next/image"
import { routing } from "@/i18n/routing"
import FptLogo from "@/public/images/fpt-logo.png"

import LoginForm from "../_components/login-form"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

function LoginPage() {
  return (
    <div className="flex w-1/3 flex-col items-center justify-center gap-6 overflow-hidden rounded-lg bg-white shadow-lg">
      <div className="container space-y-2 rounded-lg border-2 p-8 shadow-2xl">
        <div className="flex justify-center">
          <Image src={FptLogo.src} alt="Logo" width={160} height={20} />
        </div>
        <h1 className="text-center text-xl font-semibold">Welcome Back!</h1>
        <p className="text-center text-gray-400">
          Sign in to continue to FPT e-Library System
        </p>
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage
