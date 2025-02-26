"use client"

import { useAuth } from "@/contexts/auth-provider"

import { Button } from "@/components/ui/button"
import { NotificationBell } from "@/components/ui/noti-bell"
import { ThemeToggle } from "@/components/theme-toggle"

function Actions() {
  const { user } = useAuth()
  return (
    <div className="flex items-center gap-x-2 lg:pr-5">
      <Button variant={"outline"}>Đăng kí thẻ thư viện</Button>
      {user && <NotificationBell />}
      <ThemeToggle />
    </div>
  )
}

export default Actions
