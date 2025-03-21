import React from "react"

import { SidebarProvider } from "@/components/ui/sidebar"
import { ManagementSidebar } from "@/components/sidebar/management-sidebar"

import ManagementNavbar from "./_components/management-navbar"

type Props = {
  children: React.ReactNode
}

function ManagementLayout({ children }: Props) {
  return (
    <SidebarProvider defaultOpen>
      <div className="relative w-full">
        <ManagementNavbar />
        <div className="flex w-full">
          <ManagementSidebar />
          <section className="flex min-h-screen flex-1 flex-col p-6 pt-[88px]">
            <div className="mx-auto w-full max-w-[1620px]">{children}</div>
          </section>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default ManagementLayout
