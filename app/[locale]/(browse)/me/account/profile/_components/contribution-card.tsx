"use client"

import { Notebook } from "lucide-react"
import { useTranslations } from "next-intl"

const ContributionCard = () => {
  const t = useTranslations("Me.Account.Profile")

  return (
    <div className="flex h-full w-1/6 flex-col justify-between rounded-lg bg-purple-400 p-4 text-white shadow-lg">
      <div className="flex">
        <div className="rounded-lg bg-white p-2">
          <Notebook className="size-12 text-purple-400" />
        </div>
        <div className="flex h-full flex-1 items-center justify-center text-4xl">
          10
        </div>
      </div>
      <p className="text-xl">{t("contribution")}</p>
    </div>
  )
}

export default ContributionCard
