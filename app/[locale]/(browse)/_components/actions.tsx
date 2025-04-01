"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-provider"
import { useRouter } from "@/i18n/routing"
import { Calendar, Clock } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { NotificationBell } from "@/components/ui/noti-bell"
import { ThemeToggle } from "@/components/theme-toggle"

import OverviewBorrowList from "./overview-borrow-list"
import OverviewFavoriteList from "./overview-favorite-list"

function Actions() {
  const t = useTranslations("GeneralManagement")
  const router = useRouter()
  const { user, isLoadingAuth } = useAuth()
  const [currentDate, setCurrentDate] = useState<string | null>(null)
  // const locale = useLocale()
  // const pathname = usePathname()

  // const newLocale = locale === "en" ? "vi" : "en"
  useEffect(() => {
    // Update currentDate only on the client
    const interval = setInterval(() => {
      setCurrentDate(
        new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (isLoadingAuth) return null

  // const switchLanguage = () => {
  //   startTransition(() => {
  //     router.push(`${pathname}`, { scroll: false, locale: newLocale })
  //   })
  // }

  return (
    <div className="flex items-center">
      {/* <Select onValueChange={() => switchLanguage()} defaultValue={locale}>
        <SelectTrigger className="w-[140px]">
          <Languages size={20} />
          <SelectValue placeholder={t("language")} />
        </SelectTrigger>
        <SelectContent className="">
          <SelectItem value="en">{t("english")}</SelectItem>
          <SelectItem value="vi">{t("vietnamese")}</SelectItem>
        </SelectContent>
      </Select> */}
      <section className="flex items-center gap-4 text-nowrap rounded-md p-1 text-muted-foreground max-xl:hidden">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock size={16} />
          {currentDate || "--:--"}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar size={16} />
          {new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      </section>
      {user && !user.libraryCard && (
        <Button
          variant={"outline"}
          onClick={() => router.push("/me/account/library-card")}
          className="mx-2"
        >
          {t("register library card")}
        </Button>
      )}
      <OverviewFavoriteList />
      <OverviewBorrowList />
      <ThemeToggle />
      <NotificationBell />
    </div>
  )
}

export default Actions
