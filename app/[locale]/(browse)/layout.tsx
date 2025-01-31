import React from "react"

import { SidebarProvider } from "@/components/ui/sidebar"
import { BrowseSidebar } from "@/components/sidebar/browse-sidebar"

import BrowseNavbar from "./_components/browse-navbar"

type Props = {
  children: React.ReactNode
}

function BrowserLayout({ children }: Props) {
  return (
    <SidebarProvider defaultOpen>
      <BrowseSidebar />
      <main className="flex w-full flex-col p-6">
        <BrowseNavbar />
        {children}
      </main>
    </SidebarProvider>
  )
}

export default BrowserLayout
