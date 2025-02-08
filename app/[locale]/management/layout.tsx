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
      <ManagementSidebar />
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-4 p-6">
        <ManagementNavbar />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default ManagementLayout
