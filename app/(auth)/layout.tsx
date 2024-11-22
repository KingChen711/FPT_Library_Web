import React from "react"

type Props = {
  children: React.ReactNode
}

function AuthLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center p-6">
      {children}
    </div>
  )
}

export default AuthLayout
