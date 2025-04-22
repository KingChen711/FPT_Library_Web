import { type ComponentProps } from "react"
import { auth } from "@/queries/auth"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import ManagementSidebarFooter from "../hoc/log-out-button"
import SidebarSettings from "../ui/sidebar-settings"
import ManagementSidebarContent from "./management-sidebar-content"
import SidebarLogoItem from "./sidebar-logo-item"

export async function ManagementSidebar({
  ...props
}: ComponentProps<typeof Sidebar>) {
  const user = await auth().whoAmI()

  return (
    <Sidebar className="sticky" collapsible="icon" {...props}>
      <SidebarTrigger className="absolute left-full top-8 z-50 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground max-lg:hidden" />

      <SidebarHeader className="flex justify-center pb-0">
        <SidebarMenu>
          <SidebarLogoItem />
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <ManagementSidebarContent />
      </SidebarContent>
      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          <SidebarSettings />

          {user && <ManagementSidebarFooter user={user} />}
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
