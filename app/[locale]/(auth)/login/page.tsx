import React from "react"
import Image from "next/image"
import fptLogo from "@/public/assets/images/fpt-logo.png"

import LoginForm from "../_components/login-form"

function LoginPage() {
  return (
    <div className="flex w-[420px] max-w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-lg bg-card shadow-lg">
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
          <h1 className="text-center text-lg font-semibold">Welcome Back!</h1>
          <p className="text-center text-sm text-muted-foreground">
            Sign in to continue to FPT e-Library System
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage
