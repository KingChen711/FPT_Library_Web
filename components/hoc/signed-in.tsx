import React from "react"
import { auth } from "@/queries/auth/auth"

type Props = {
  children: React.ReactNode
}

function SignedIn({ children }: Props) {
  const { isAuthenticated } = auth()

  if (!isAuthenticated) return null

  return <>{children}</>
}

export default SignedIn
