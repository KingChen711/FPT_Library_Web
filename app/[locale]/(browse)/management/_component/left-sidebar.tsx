"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { managementRoutes } from "@/constants"

import { cn } from "@/lib/utils"

import Logo from "./logo"

function LeftSidebar() {
  const pathname = usePathname()

  console.log({ pathname })

  return (
    <section className="sticky left-0 top-0 flex h-screen w-fit shrink-0 flex-col justify-between overflow-y-auto border-r bg-card dark:shadow-none max-sm:hidden lg:w-[300px]">
      <div className="flex flex-col">
        <Logo />
        <div className="flex flex-col pr-9 max-lg:px-6">
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
                  "flex items-center justify-start gap-4 p-4 text-muted-foreground lg:pl-9",
                  isActive && "rounded-r-full text-foreground max-lg:rounded-lg"
                )}
              >
                <Icon className={cn("size-5")} />

                <p className={cn("max-lg:hidden", isActive && "font-semibold")}>
                  {label}
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
