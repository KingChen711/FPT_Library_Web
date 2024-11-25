import React from "react"

type Props = {
  children: React.ReactNode
}

function AuthLayout({ children }: Props) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-y-6 px-6 py-8">
      {children}
    </div>
  )
}

export default AuthLayout
