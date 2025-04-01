"use client"

import { type ComponentProps } from "react"
import { useAuth } from "@/contexts/auth-provider"
import { Link, useRouter } from "@/i18n/routing"
import { BadgeCheck, ChevronsUpDown, LogOut, User } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

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
  useSidebar,
} from "@/components/ui/sidebar"

import { Button } from "../ui/button"
import { Icons } from "../ui/icons"
import BrowseSidebarContent from "./browse-sidebar-content"
import SidebarLogoItem from "./sidebar-logo-item"

export function BrowseSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const locale = useLocale()
  const { user } = useAuth()
  const t = useTranslations("Me")
  const tRoutes = useTranslations("Routes")
  const { isMobile, open } = useSidebar()

  return (
    <Sidebar className="sticky" collapsible="icon" {...props}>
      <SidebarTrigger className="absolute left-full top-8 z-50 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground max-lg:hidden" />
      <SidebarHeader>
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
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={tRoutes("Settings")} asChild>
                <Link href={"/settings"}>
                  <Icons.Setting />
                  <span>{tRoutes("Settings")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton tooltip={tRoutes("Help")} asChild>
                <Link href={"/help"}>
                  <Icons.Help />
                  <span>{tRoutes("Help")}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Link href={`#`} className="flex items-center gap-2 p-2">
                    <User size={20} />
                    {open && (
                      <div className="flex flex-1 justify-between text-left text-sm leading-tight">
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
                    )}
                  </Link>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-md"
                  side={isMobile ? "bottom" : "right"}
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
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => router.push("/me/account/profile")}
                    >
                      <BadgeCheck />
                      {t("account")}
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
                  <DropdownMenuItem className="cursor-pointer">
                    <LogOut />
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      ) : (
        <Button
          variant={"link"}
          className="w-full text-foreground"
          onClick={() => router.push("/login")}
        >
          {t("login")}
        </Button>
      )}
      <SidebarRail />
    </Sidebar>
  )
}
