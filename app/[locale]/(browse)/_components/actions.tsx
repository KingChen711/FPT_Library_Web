"use client"

import { useRouter } from "@/i18n/routing"

import { Button } from "@/components/ui/button"
import { NotificationBell } from "@/components/ui/noti-bell"
import { ThemeToggle } from "@/components/theme-toggle"

function Actions() {
  const router = useRouter()

  return (
    <div className="flex items-center gap-x-2 lg:pr-5">
      <Button variant={"outline"}>Đăng kí thẻ thư viện</Button>
      <NotificationBell />
      <ThemeToggle />
    </div>
  )
}

export default Actions
