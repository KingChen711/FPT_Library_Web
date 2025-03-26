import React from "react"

import { SidebarProvider } from "@/components/ui/sidebar"
import { BrowseSidebar } from "@/components/sidebar/browse-sidebar"

import BrowseNavbar from "./_components/browse-navbar"

type Props = {
  children: React.ReactNode
}

{
  /* <main className='background-light850_dark100 relative'>
<Navbar />
<div className='flex'>
  <LeftSidebar />
  <section className='flex min-h-screen flex-1 flex-col px-6 pb-6 pt-36 max-md:pb-14 sm:px-14'>
    <div className='mx-auto w-full max-w-5xl'>{children}</div>
  </section>
  <RightSidebar />
</div>
<Toaster />
</main> */
}

function BrowserLayout({ children }: Props) {
  return (
    <SidebarProvider defaultOpen>
      <div className="relative w-full">
        <BrowseNavbar />
        <div className="flex w-full">
          <BrowseSidebar />
          <section className="relative flex min-h-screen flex-1 flex-col p-6 pt-[88px]">
            <div className="mx-auto w-full max-w-[1620px] flex-1">
              {children}
            </div>
          </section>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default BrowserLayout
