import { type ReactNode } from "react"

import HeaderTabAccount from "./_components/account-header-tab"

type AccountLayoutProps = {
  children: ReactNode
  params: { locale: string }
}

const AccountLayout = ({ children, params }: AccountLayoutProps) => {
  return (
    <div className="flex h-full flex-col gap-4 rounded-lg p-4 shadow-lg">
      <HeaderTabAccount locale={params.locale} />
      <div className="mt-4">{children}</div>
    </div>
  )
}

export default AccountLayout
