"use client"

import React from "react"
import { BookOpen } from "lucide-react"
import { useTranslations } from "next-intl"

const ReadingCard = () => {
  const t = useTranslations("Me.Account.Profile")

  return (
    <div className="flex h-full w-1/6 flex-col justify-between rounded-lg bg-primary p-4 text-white shadow-lg">
      <div className="flex">
        <div className="rounded-lg bg-white p-2">
          <BookOpen className="size-12 text-primary" />
        </div>
        <div className="flex h-full flex-1 items-center justify-center text-4xl">
          120
        </div>
      </div>
      <p className="text-xl">{t("reading")}</p>
    </div>
  )
}

export default ReadingCard
