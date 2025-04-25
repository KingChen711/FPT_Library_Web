"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-provider"
import { format } from "date-fns"
import { Calendar, Clock } from "lucide-react"
import { useTranslations } from "next-intl"

import useFormatLocale from "@/hooks/utils/use-format-locale"
import { Button } from "@/components/ui/button"
import { NotificationBell } from "@/components/ui/noti-bell"
import { ThemeToggle } from "@/components/theme-toggle"

import OverviewBorrowList from "./overview-borrow-list"
import OverviewFavoriteList from "./overview-favorite-list"

function Actions() {
  const t = useTranslations("GeneralManagement")
  const formatLocale = useFormatLocale()
  const router = useRouter()
  const { user, isLoadingAuth, isManager } = useAuth()
  const [currentDate, setCurrentDate] = useState<string | null>(null)

  useEffect(() => {
    // Update currentDate only on the client
    const interval = setInterval(() => {
      setCurrentDate(format(new Date(Date.now()), "HH:mm"))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (isLoadingAuth) return null

  return (
    <div className="flex items-center">
      <section className="flex items-center gap-4 text-nowrap rounded-md text-muted-foreground max-lg:hidden">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock size={16} />
          <span className="leading-none">{currentDate || "--:--"}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar size={16} />
          <span className="leading-none">
            {format(new Date(Date.now()), "dd MMM yyyy", {
              locale: formatLocale,
            })}
          </span>
        </div>
      </section>
      {!isManager && user && !user.libraryCard && (
        <Button
          variant={"outline"}
          onClick={() => router.push("/me/account/library-card")}
          className="mx-2"
        >
          {t("register library card")}
        </Button>
      )}
      {!isManager && (
        <div className="flex items-center">
          {user && <OverviewFavoriteList />}
          <OverviewBorrowList />
        </div>
      )}
      <ThemeToggle />
      {user && <NotificationBell />}
    </div>
  )
}

export default Actions
