import React from "react"
import { routing } from "@/i18n/routing"

import LoginForm from "../_components/login-form"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

function LoginPage() {
  return <LoginForm />
}

export default LoginPage
