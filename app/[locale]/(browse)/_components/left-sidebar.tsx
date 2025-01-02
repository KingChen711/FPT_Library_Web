"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { browseRoutes } from "@/constants"
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
        "sticky left-0 top-0 z-20 flex h-screen w-[110px] shrink-0 flex-col justify-between overflow-y-auto border-r bg-card transition-all dark:shadow-none max-sm:hidden lg:w-[300px]",
        isCollapsed && "lg:w-[110px]"
      )}
    >
      <div className="flex flex-col">
        <Logo />
        <div
          className={cn(
            "h-0 w-full transition-all lg:h-2",
            isCollapsed && "lg:h-0"
          )}
        ></div>
        <div
          className={cn(
            "flex flex-col transition-all max-lg:px-6 lg:px-3",
            isCollapsed && "lg:px-6"
          )}
        >
          <div
            onClick={() => toggle()}
            className={cn(
              "flex cursor-pointer items-center justify-start rounded-lg p-4 text-muted-foreground transition-all hover:bg-border/30 max-lg:hidden",
              !isCollapsed && "absolute right-0 top-0",
              isCollapsed && "w-fit"
            )}
          >
            {isCollapsed ? (
              <ArrowRightFromLine size={20} />
            ) : (
              <ArrowLeftFromLine size={20} />
            )}
          </div>

          {browseRoutes.map(({ Icon, label, route }) => {
            const isActive =
              (pathname.slice(3).startsWith(route) && route !== "") ||
              (pathname.slice(3) === "" && route === "")

            return (
              <Link
                key={route}
                href={route}
                className={cn(
                  "flex items-center justify-start gap-4 rounded-lg p-4 text-muted-foreground hover:bg-border/30 max-lg:w-fit",
                  isActive && "bg-border/30 text-primary",
                  isCollapsed && "w-fit"
                )}
              >
                <Icon className={cn("inline-block size-5")} />

                <p
                  className={cn(
                    "h-5 overflow-hidden text-nowrap transition-all max-lg:hidden",
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
