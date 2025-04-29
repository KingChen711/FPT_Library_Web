"use client"

import React, { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { BadgeCheck, ChevronsUpDown, Loader2, LogOut, User } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { ERoleType } from "@/lib/types/enums"
import { type Employee, type User as TUser } from "@/lib/types/models"
import { logout } from "@/actions/auth/log-out"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar"

type Props = {
  user: TUser | Employee
}

function ManagementSidebarFooter({ user }: Props) {
  const t = useTranslations("Me")
  const [isPending, startTransition] = useTransition()
  const locale = useLocale()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [openDropdown, setOpenDropdown] = useState(false)

  const handleLogout = () => {
    startTransition(async () => {
      const res = await logout()
      if (res.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["token"] })
        router.push("/login")
        return
      }
      handleServerActionError(res, locale)
    })
  }

  const handleOpenChange = (value: boolean) => {
    if (isPending) return
    setOpenDropdown(value)
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <DropdownMenu open={openDropdown} onOpenChange={handleOpenChange}>
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
            <DropdownMenuItem
              disabled={isPending}
              onClick={handleLogout}
              className="cursor-pointer"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <LogOut className="size-4" />
              )}
              {t("logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export default ManagementSidebarFooter
