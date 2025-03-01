"use client"

import { useRouter } from "@/i18n/routing"
import { Book } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { NotificationBell } from "@/components/ui/noti-bell"
import { ThemeToggle } from "@/components/theme-toggle"

import OverviewFavoriteList from "./overview-favorite-list"

function Actions() {
  const t = useTranslations("GeneralManagement")
  const router = useRouter()

  return (
    <div className="flex items-center gap-x-2 lg:pr-5">
      <Button
        variant={"outline"}
        onClick={() => router.push("/me/account/library-card")}
      >
        {t("register library card")}
      </Button>
      <OverviewFavoriteList />
      <Button variant={"ghost"} size={"icon"} className="">
        <Book size={16} />
      </Button>
      <NotificationBell />
      <ThemeToggle />
    </div>
  )
}

export default Actions
