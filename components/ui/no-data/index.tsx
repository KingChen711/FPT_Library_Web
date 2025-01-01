import React from "react"
import { getLocale } from "next-intl/server"

import { cn } from "@/lib/utils"

import NodataClient from "./no-data-client"

type Props = {
  className?: string
}

async function NoData({ className }: Props) {
  if (typeof window !== "undefined") {
    return <NodataClient className={className} />
  }

  const locale = await getLocale()
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      {locale === "vi" ? "Không có dữ liệu" : "No data"}
    </p>
  )
}

export default NoData
