"use client"

import { useEffect, useState, useTransition } from "react"
import { usePathname, useRouter } from "@/i18n/routing"
import { Calendar, Clock, Languages } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"

import Actions from "./actions"

function ManagementNavbar() {
  const { open } = useSidebar()
  const router = useRouter()
  const locale = useLocale()
  const tGeneralManagement = useTranslations("GeneralManagement")
  const [currentDate, setCurrentDate] = useState<Date | null>(null)
  const pathname = usePathname()
  const [, startTransition] = useTransition()

  const newLocale = locale === "en" ? "vi" : "en"

  useEffect(() => {
    setCurrentDate(new Date()) // Set the current date when the component mounts

    const interval = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const switchLanguage = () => {
    startTransition(() => {
      router.push(`${pathname}`, { scroll: false, locale: newLocale })
    })
  }

  return (
    <nav className="relative mb-16">
      <div
        className={`fixed top-0 z-10 flex h-16 w-full items-center justify-between border-b bg-card px-6 transition-all`}
        style={{
          left: open ? "var(--sidebar-width, 0)" : "3rem",
          width: open
            ? "calc(100% - var(--sidebar-width, 0))"
            : "calc(100% - var(--sidebar-width-icon, 0))",
        }}
      >
        <SidebarTrigger className="absolute -left-3 top-1/2 z-20 -translate-y-1/2 bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground" />
        <div className={cn("flex items-center gap-4")}>
          <Select onValueChange={() => switchLanguage()} defaultValue={locale}>
            <SelectTrigger className="w-[140px]">
              <Languages size={20} />
              <SelectValue placeholder="Lang" />
            </SelectTrigger>
            <SelectContent className="">
              <SelectItem value="en">
                {tGeneralManagement("english")}
              </SelectItem>
              <SelectItem value="vi">
                {tGeneralManagement("vietnamese")}
              </SelectItem>
            </SelectContent>
          </Select>
          <section className="flex items-center gap-4 text-nowrap rounded-lg p-1 text-muted-foreground">
            {currentDate && ( // Render the date and time only if currentDate is available
              <>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock size={16} />
                  {currentDate.toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar size={16} />
                  {currentDate.toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </>
            )}
          </section>
        </div>
        <Actions />
      </div>
    </nav>
  )
}

export default ManagementNavbar
