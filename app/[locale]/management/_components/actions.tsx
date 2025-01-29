"use client"

import { NotificationBell } from "@/components/ui/noti-bell"
import { ThemeToggle } from "@/components/theme-toggle"

function Actions() {
  return (
    <div className="flex items-center gap-x-2 lg:pr-5">
      <NotificationBell />
      <ThemeToggle />
    </div>
  )
}

export default Actions
