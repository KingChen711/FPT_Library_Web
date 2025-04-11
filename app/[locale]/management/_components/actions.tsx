"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Calendar, Clock } from "lucide-react"

import useFormatLocale from "@/hooks/utils/use-format-locale"
import { NotificationBell } from "@/components/ui/noti-bell"
import { ThemeToggle } from "@/components/theme-toggle"

function Actions() {
  const formatLocale = useFormatLocale()

  const [currentDate, setCurrentDate] = useState<string>(
    format(new Date(Date.now()), "HH:mm")
  )

  useEffect(() => {
    // Update currentDate only on the client
    const interval = setInterval(() => {
      setCurrentDate(format(new Date(Date.now()), "HH:mm"))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-x-2">
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
      <NotificationBell />
      <ThemeToggle />
    </div>
  )
}

export default Actions
