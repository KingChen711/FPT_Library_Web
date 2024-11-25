import React from "react"
import { routing } from "@/i18n/routing"

type Props = {
  children: React.ReactNode
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

function AuthLayout({ children }: Props) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-y-6 px-6 py-8">
      {children}
    </div>
  )
}

export default AuthLayout
