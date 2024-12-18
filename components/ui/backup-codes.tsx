"use client"

import React from "react"
import { useLocale } from "next-intl"

import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

type Props = {
  codes: string[]
  className?: string
}

function BackupCodes({ codes, className }: Props) {
  const locale = useLocale()
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      //   variant: "info",
      description: (
        <div>
          {locale === "vi" ? "Bạn đã copy mã" : "You have saved"}{" "}
          <strong>{code}</strong>
        </div>
      ),
    })
  }
  return (
    <div className={cn("mt-3 flex flex-wrap justify-center gap-2", className)}>
      {codes.map((code) => (
        <div
          key={code}
          onClick={() => handleCopyCode(code)}
          className="cursor-pointer select-none rounded-md border bg-card px-2 text-card-foreground"
        >
          {code}
        </div>
      ))}
    </div>
  )
}

export default BackupCodes
