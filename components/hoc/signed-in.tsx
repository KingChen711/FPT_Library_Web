import React from "react"
import { useAuth } from "@/contexts/auth-provider"
import { auth } from "@/queries/auth"

import AuthLoaded from "./auth-loaded"

type Props = {
  children: React.ReactNode
}

function SignedIn({ children }: Props) {
  if (typeof window === "undefined") {
    const { isAuthenticated } = auth()

    if (!isAuthenticated) return null

    return <>{children}</>
  }

  return (
    <AuthLoaded>
      <ClientSignedIn>{children}</ClientSignedIn>
    </AuthLoaded>
  )
}

export default SignedIn

function ClientSignedIn({ children }: Props) {
  const { user } = useAuth()

  if (!user) return null

  return <>{children}</>
}
