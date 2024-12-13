"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { managementRoutes } from "@/constants"
import { useManagementSideBar } from "@/stores/use-management-sidebar"
import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"

import Logo from "./logo"

function LeftSidebar() {
  const pathname = usePathname()
  const t = useTranslations("Routes")
  const { toggle, isCollapsed } = useManagementSideBar()

  return (
    <section
      className={cn(
        "sticky left-0 top-0 flex h-screen w-fit shrink-0 flex-col justify-between overflow-y-auto border-r bg-card dark:shadow-none max-sm:hidden lg:w-[300px]",
        isCollapsed && "lg:w-fit"
      )}
    >
      <div className="flex flex-col">
        <Logo />
        <div className={cn("h-0 w-full lg:h-2", isCollapsed && "lg:h-0")}></div>
        <div
          className={cn(
            "flex flex-col max-lg:px-6 lg:px-3",
            isCollapsed && "lg:px-6"
          )}
        >
          <div
            onClick={() => toggle()}
            className={cn(
              "flex cursor-pointer items-center justify-start rounded-lg p-4 text-muted-foreground hover:bg-border/30",
              !isCollapsed && "absolute right-0 top-0"
            )}
          >
            {isCollapsed ? (
              <ArrowRightFromLine size={20} />
            ) : (
              <ArrowLeftFromLine size={20} />
            )}
          </div>
          {managementRoutes.map(({ Icon, label, route }) => {
            const isActive =
              (pathname.slice(3).startsWith(route) &&
                route !== "/management") ||
              (pathname.slice(3) === "/management" && route === "/management")

            return (
              <Link
                key={route}
                href={route}
                className={cn(
                  "flex items-center justify-start gap-4 rounded-lg p-4 text-muted-foreground hover:bg-border/30",
                  isActive && "bg-border/30 text-primary"
                )}
              >
                <Icon className={cn("size-5")} />

                <p
                  className={cn(
                    "max-lg:hidden",
                    isActive && "font-semibold",
                    isCollapsed && "hidden"
                  )}
                >
                  {t(label)}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default LeftSidebar
