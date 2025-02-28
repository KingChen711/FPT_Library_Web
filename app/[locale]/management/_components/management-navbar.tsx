"use client"

import { useEffect, useState } from "react"
import { Calendar, Clock, Languages } from "lucide-react"

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
  const [currentDate, setCurrentDate] = useState<Date | null>(null)

  useEffect(() => {
    setCurrentDate(new Date()) // Set the current date when the component mounts

    const interval = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

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
          <Select>
            <SelectTrigger className="w-[140px]">
              <Languages size={20} />
              <SelectValue placeholder="Lang" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="vi">Vietnamese</SelectItem>
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
