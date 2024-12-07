import React from "react"
import { GoogleOAuthProvider } from "@react-oauth/google"

type Props = {
  children: React.ReactNode
}

function AuthLayout({ children }: Props) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <div className="flex min-h-dvh flex-col items-center justify-center gap-y-6 px-6 py-8">
        {children}
      </div>
    </GoogleOAuthProvider>
  )
}

export default AuthLayout
