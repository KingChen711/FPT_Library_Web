import { type ReactNode } from "react"

import HeaderTabAccount from "./_components/account-header-tab"

type AccountLayoutProps = {
  children: ReactNode
  params: { locale: string }
}

const AccountLayout = ({ children, params }: AccountLayoutProps) => {
  return (
    <div className="flex h-full items-start justify-start gap-6">
      <div className="h-full w-[260px] self-stretch overflow-y-auto rounded-md border shadow-md">
        <HeaderTabAccount locale={params.locale} />
      </div>
      <div className="h-full flex-1 overflow-y-auto">{children}</div>
    </div>
  )
}

export default AccountLayout
