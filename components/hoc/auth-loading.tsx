"use client"

import React from "react"
import { useAuth } from "@/contexts/auth-provider"

type Props = {
  children: React.ReactNode
}

function AuthLoading({ children }: Props) {
  const { isLoadingAuth } = useAuth()

  if (!isLoadingAuth) {
    return null
  }

  return <>{children}</>
}

export default AuthLoading
