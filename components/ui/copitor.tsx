"use client"

import React from "react"
import { Copy } from "lucide-react"
import { useLocale } from "next-intl"

import { cn } from "@/lib/utils"
import { toast } from "@/hooks/use-toast"

type Props = {
  content: string | null | undefined
  className?: string
}

function Copitor({ content, className }: Props) {
  const locale = useLocale()
  const handleCopy = () => {
    if (!content) return
    navigator.clipboard.writeText(content)
    toast({
      description: (
        <div>
          {locale === "vi" ? "Bạn đã sao chép" : "You have saved"}{" "}
          <strong>{content}</strong>
        </div>
      ),
    })
  }

  if (!content) return null

  return (
    <Copy
      className={cn(
        "size-5 cursor-pointer text-primary hover:text-foreground",
        className
      )}
      onClick={handleCopy}
    />
  )
}

export default Copitor
