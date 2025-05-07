import { type ComponentProps } from "react"
import Link from "next/link"
import { auth } from "@/queries/auth"

import { getTranslations } from "@/lib/get-translations"
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
import { Button } from "../ui/button"
import SidebarSettings from "../ui/sidebar-settings"
import BrowseSidebarContent from "./browse-sidebar-content"
import SidebarLogoItem from "./sidebar-logo-item"

export async function BrowseSidebar({
  ...props
}: ComponentProps<typeof Sidebar>) {
  const t = await getTranslations("Me")
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
        <BrowseSidebarContent />
      </SidebarContent>

      <SidebarSeparator />

      {user ? (
        <SidebarFooter>
          <SidebarMenu>
            <SidebarSettings />

            {user && <ManagementSidebarFooter user={user} />}
          </SidebarMenu>
        </SidebarFooter>
      ) : (
        <Button variant={"link"} className="w-full text-foreground" asChild>
          <Link href="/login">{t("login")}</Link>
        </Button>
      )}
      <SidebarRail />
    </Sidebar>
  )
}
