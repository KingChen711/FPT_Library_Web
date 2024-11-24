import React from "react"
import { useAuth } from "@/contexts/auth-provider"
import { auth } from "@/queries/auth"

import AuthLoaded from "./auth-loaded"

type Props = {
  children: React.ReactNode
}

function SignedOut({ children }: Props) {
  if (typeof window === "undefined") {
    const { isAuthenticated } = auth()

    if (isAuthenticated) return null

    return <>{children}</>
  }

  return (
    <AuthLoaded>
      <ClientSignedOut>{children}</ClientSignedOut>
    </AuthLoaded>
  )
}

export default SignedOut

function ClientSignedOut({ children }: Props) {
  const { user } = useAuth()

  if (user) return null

  return <>{children}</>
}
