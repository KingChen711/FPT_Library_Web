"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-provider"
import { Bell, IdCard, Shield, User } from "lucide-react"
import { useTranslations } from "next-intl"

import { ESystemRoutes } from "@/lib/types/enums"
import { cn } from "@/lib/utils"

type AccountHeaderTabProps = {
  locale: string
}

const AccountHeaderTab = ({ locale }: AccountHeaderTabProps) => {
  const t = useTranslations("Me")
  const pathname = usePathname()
  const { isManager } = useAuth()
  const isActive = (route: string) => pathname.startsWith(`/${locale}${route}`)

  const accountRoutes = [
    {
      label: "profile",
      route: ESystemRoutes.PROFILE_MANAGEMENT,
      icon: User,
      isShown: true,
    },
    {
      label: "library card",
      route: ESystemRoutes.LIBRARY_CARD_MANAGEMENT,
      icon: IdCard,
      isShown: true && !isManager,
    },
    {
      label: "borrow",
      route: ESystemRoutes.BORROW_MANAGEMENT,
      icon: IdCard,
      isShown: true && !isManager,
    },
    {
      label: "reservation",
      route: ESystemRoutes.RESERVATION_MANAGEMENT,
      icon: IdCard,
      isShown: true && !isManager,
    },
    {
      label: "transaction",
      route: ESystemRoutes.TRANSACTION_MANAGEMENT,
      icon: IdCard,
      isShown: true && !isManager,
    },
    {
      label: "security",
      route: ESystemRoutes.SECURITY_MANAGEMENT,
      icon: Shield,
      isShown: true,
    },
    {
      label: "notifications",
      route: ESystemRoutes.NOTIFICATION_MANAGEMENT,
      icon: Bell,
      isShown: true,
    },
  ]

  return (
    <nav className="flex h-full flex-col space-y-1 bg-background p-2">
      {accountRoutes.map((route) => {
        const Icon = route.icon
        if (route.isShown === false) return null
        return (
          <Link
            key={route.label}
            href={`${route.route}`}
            className={cn(
              "flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-muted",
              isActive(route.route)
                ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="size-5" />
            <span>{t(route.label)}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export default AccountHeaderTab
