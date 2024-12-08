import React, { Suspense } from "react"

import LeftSidebar from "./_component/left-sidebar"
import ManagementNavbar from "./_component/management-navbar"

type Props = {
  children: React.ReactNode
}

function ManagementLayout({ children }: Props) {
  return (
    <main className="relative bg-background">
      <ManagementNavbar />
      <div className="flex">
        <LeftSidebar />
        <section className="flex min-h-screen flex-1 flex-col bg-slate-200 px-6 pb-6 pt-20 max-md:pb-14 sm:px-8">
          <div className="mx-auto size-full max-w-[1400px]">
            <Suspense>{children}</Suspense>
          </div>
        </section>
      </div>
    </main>
  )
}

export default ManagementLayout
