"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { ESystemRoutes } from "@/lib/types/enums"
import { cn } from "@/lib/utils"

type AccountHeaderTabProps = {
  locale: string
}

const accountRoutes = [
  {
    label: "Profile",
    route: ESystemRoutes.PROFILE_MANAGEMENT,
  },
  {
    label: "Security",
    route: ESystemRoutes.SECURITY_MANAGEMENT,
  },
  {
    label: "Interface",
    route: ESystemRoutes.INTERFACE_MANAGEMENT,
  },
  {
    label: "Notifications",
    route: ESystemRoutes.NOTIFICATION_MANAGEMENT,
  },
]

const AccountHeaderTab = ({ locale }: AccountHeaderTabProps) => {
  const pathname = usePathname()

  const isActive = (route: string) => pathname === `/${locale}${route}`

  return (
    <div className="flex items-center">
      {accountRoutes.map((route) => (
        <Link
          key={route.label}
          href={`/${locale}${route.route}`}
          className={cn(
            "w-[120px] border-b-2 pb-1 text-center text-base font-semibold text-muted-foreground hover:border-primary hover:text-primary",
            isActive(route.route) && "border-primary text-primary"
          )}
        >
          {route.label}
        </Link>
      ))}
    </div>
  )
}

export default AccountHeaderTab
