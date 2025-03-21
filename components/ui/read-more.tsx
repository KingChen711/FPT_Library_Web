"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"

type Props = {
  children: ReactNode
}

export const StyledReadMore = ({ children }: Props) => {
  const t = useTranslations("GeneralManagement")
  const [showMore, setShowMore] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(contentRef.current).lineHeight
      )
      const maxHeight = lineHeight * 3 // Giới hạn 3 dòng
      setIsOverflowing(contentRef.current.scrollHeight > maxHeight)
    }
  }, [children])

  return (
    <div className="mt-2">
      <div
        ref={contentRef}
        className={cn(
          "line-clamp-3 flex-1 text-ellipsis text-sm",
          showMore && "line-clamp-none"
        )}
        dangerouslySetInnerHTML={{ __html: children as string }}
      />
      {isOverflowing && (
        <div
          onClick={() => setShowMore(!showMore)}
          className="mt-2 cursor-pointer text-sm underline hover:opacity-90"
        >
          {showMore ? t("show less") : t("show more")}
        </div>
      )}
    </div>
  )
}
