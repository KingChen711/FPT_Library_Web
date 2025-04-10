import { type ComponentProps } from "react"
import Link from "next/link"
import { auth } from "@/queries/auth"
import { BadgeCheck, ChevronsUpDown, LogOut, User } from "lucide-react"
import { getLocale } from "next-intl/server"

import { getTranslations } from "@/lib/get-translations"
import { ERoleType } from "@/lib/types/enums"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { Icons } from "../ui/icons"
import SidebarSettings from "../ui/sidebar-settings"
import ManagementSidebarContent from "./management-sidebar-content"
import SidebarLogoItem from "./sidebar-logo-item"

export async function ManagementSidebar({
  ...props
}: ComponentProps<typeof Sidebar>) {
  const tRoutes = await getTranslations("Routes")
  const user = await auth().whoAmI()
  const locale = await getLocale()
  const t = await getTranslations("Me")

  return (
    <Sidebar className="sticky" collapsible="icon" {...props}>
      <SidebarTrigger className="absolute left-full top-8 z-50 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground max-lg:hidden" />

      <SidebarHeader className="flex h-16 justify-center">
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
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={tRoutes("Settings")} asChild>
              <Link href={"/settings"}>
                <Icons.Setting />
                <span>{tRoutes("Settings")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarSettings />

          <SidebarMenuItem>
            <SidebarMenuButton tooltip={tRoutes("Help")} asChild>
              <Link href={"/help"}>
                <Icons.Help />
                <span>{tRoutes("Help")}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {user && (
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="peer/menu-button flex h-10 w-full cursor-pointer items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0">
                      <User className="size-4" />

                      <div className="flex flex-1 items-center justify-between text-left text-sm leading-tight">
                        <div className="flex flex-col">
                          <span className="truncate font-semibold">{`${user?.firstName} ${user?.lastName}`}</span>
                          <span className="truncate text-xs">
                            {locale === "vi"
                              ? user?.role.vietnameseName
                              : user?.role.englishName}
                          </span>
                        </div>
                        <ChevronsUpDown className="ml-auto size-4" />
                      </div>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-md"
                    side="right"
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <User size={40} />
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">{`${user?.firstName} ${user?.lastName}`}</span>
                          <span className="truncate text-xs">
                            {locale === "vi"
                              ? user?.role.vietnameseName
                              : user?.role.englishName}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="cursor-pointer" asChild>
                        <Link href="/me/account/profile">
                          <BadgeCheck />
                          {t("account")}
                        </Link>
                      </DropdownMenuItem>
                      {(user.role.roleType === ERoleType.EMPLOYEE ||
                        user.role.roleId === 1) && (
                        <DropdownMenuItem className="cursor-pointer" asChild>
                          <Link href="/management">
                            <BadgeCheck />
                            {t("management page")}
                          </Link>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    {/* TODO:logout */}
                    <DropdownMenuItem className="cursor-pointer">
                      <LogOut />
                      {t("logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
