import { type ReactNode } from "react"

import HeaderTabAccount from "./_components/account-header-tab"

type AccountLayoutProps = {
  children: ReactNode
  params: { locale: string }
}

const AccountLayout = ({ children, params }: AccountLayoutProps) => {
  return (
    <div className="flex h-[82vh] items-start justify-start gap-4">
      <div className="h-[82vh] w-1/5 overflow-y-auto rounded-md border shadow-md">
        <HeaderTabAccount locale={params.locale} />
      </div>
      <div className="h-full flex-1 overflow-y-auto">{children}</div>
    </div>
  )
}

export default AccountLayout
