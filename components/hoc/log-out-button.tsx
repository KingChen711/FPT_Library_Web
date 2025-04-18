"use client"

import React, { useTransition } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2, LogOut } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import handleServerActionError from "@/lib/handle-server-action-error"
import { logout } from "@/actions/auth/log-out"

import { DropdownMenuItem } from "../ui/dropdown-menu"

function LogOutButton() {
  const t = useTranslations("Me")
  const [isPending, startTransition] = useTransition()
  const locale = useLocale()
  const router = useRouter()
  const queryClient = useQueryClient()

  const handleLogout = () => {
    startTransition(async () => {
      const res = await logout()
      if (res.isSuccess) {
        queryClient.invalidateQueries({ queryKey: ["token"] })
        router.push("/login")
        return
      }
      handleServerActionError(res, locale)
    })
  }

  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={handleLogout}
      className="cursor-pointer"
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <LogOut className="size-4" />
      )}
      {t("logout")}
    </DropdownMenuItem>
  )
}

export default LogOutButton
