"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-provider"
import { Calendar, Clock } from "lucide-react"

import { NotificationBell } from "@/components/ui/noti-bell"
import { ThemeToggle } from "@/components/theme-toggle"

function Actions() {
  const { user } = useAuth()

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

  return (
    <div className="flex items-center gap-x-2">
      <section className="flex items-center gap-4 text-nowrap rounded-md p-1 text-muted-foreground max-lg:hidden">
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
      {user && <NotificationBell />}
      <ThemeToggle />
    </div>
  )
}

export default Actions
