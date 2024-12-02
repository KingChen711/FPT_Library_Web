import React, { type ReactNode } from "react"

import HeaderTabAccount from "./_components/header-tab-account"

type AccountLayoutProps = {
  children: ReactNode
  params: { locale: string }
}

const AccountLayout = ({ children, params }: AccountLayoutProps) => {
  return (
    <div className="flex h-full flex-col gap-4 rounded-lg bg-white p-4 shadow-lg">
      <HeaderTabAccount locale={params.locale} />
      <div className="mt-6">{children}</div>
    </div>
  )
}

export default AccountLayout
