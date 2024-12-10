import React from "react"

import LeftSidebar from "../management/_components/left-sidebar"
import ManagementNavbar from "../management/_components/management-navbar"

type Props = {
  children: React.ReactNode
}

function BrowserLayout({ children }: Props) {
  return (
    <main className="relative bg-background">
      <ManagementNavbar />
      <div className="flex">
        <LeftSidebar />
        <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-20 max-md:pb-14 sm:px-8">
          <div className="mx-auto size-full max-w-[1400px]">{children}</div>
        </section>
      </div>
    </main>
  )
}

export default BrowserLayout
