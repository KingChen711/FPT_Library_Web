"use client"

import React from "react"
import { useLocale } from "next-intl"

import { cn } from "@/lib/utils"

type Props = {
  className?: string
}

function NoData({ className }: Props) {
  const locale = useLocale()

  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      {locale === "vi" ? "Không có dữ liệu" : "No data"}
    </p>
  )
}

export default NoData
