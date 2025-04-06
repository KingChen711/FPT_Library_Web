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
      <div className="relative w-full">
        <BrowseNavbar />
        <div className="flex w-full">
          <BrowseSidebar />
          <section className="relative flex min-h-screen flex-1 flex-col p-6 pt-[88px]">
            <div className="mx-auto w-full max-w-[1620px] flex-1 px-4">
              {children}
            </div>
          </section>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default BrowserLayout
