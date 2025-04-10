"use client"

import React from "react"
import { Link } from "@/i18n/routing"
import { ChevronsUpDown, Settings } from "lucide-react"
import { useTranslations } from "next-intl"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import { SidebarMenuItem, useSidebar } from "./sidebar"
import SidebarLanguage from "./sidebar-language"

const SidebarSettings = () => {
  const { isMobile, open } = useSidebar()
  const tRoutes = useTranslations("Routes")

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Link href={`#`} className="flex items-center gap-2 p-2">
            <Settings size={20} />
            {open && (
              <div className="flex flex-1 justify-between text-left text-sm leading-tight">
                <div className="flex flex-col">
                  <span className="truncate">{tRoutes("Settings")}</span>
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
          <SidebarLanguage />
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

export default SidebarSettings
