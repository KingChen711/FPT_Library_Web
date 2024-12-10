import React, { type ReactNode } from "react"

import LeftSidebar from "@/app/[locale]/management/_components/left-sidebar"
import ManagementNavbar from "@/app/[locale]/management/_components/management-navbar"

import HeaderTabAccount from "./_components/account-header-tab"

type AccountLayoutProps = {
  children: ReactNode
  params: { locale: string }
}

const AccountLayout = ({ children, params }: AccountLayoutProps) => {
  return (
    <main className="relative bg-background">
      <ManagementNavbar />
      <div className="flex">
        <LeftSidebar />
        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-20 max-md:pb-14 sm:px-8">
          <div className="mx-auto size-full max-w-[1400px]">
            <div className="flex h-full flex-col gap-4 rounded-lg p-4 shadow-lg">
              <HeaderTabAccount locale={params.locale} />
              <div className="mt-6">{children}</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default AccountLayout
