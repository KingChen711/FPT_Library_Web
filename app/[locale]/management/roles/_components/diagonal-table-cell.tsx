"use client"

import React, { useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { TableHead } from "@/components/ui/table"

function DiagonalTableCell() {
  const t = useTranslations("RoleManagement")
  const cell = useRef<HTMLTableCellElement>(null)
  const diagonal = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  const isRoleVerticalLayout =
    searchParams.get("isRoleVerticalLayout") === "true"

  useEffect(() => {
    if (cell.current && diagonal.current) {
      const deg = (
        (Math.atan(cell.current.clientHeight / cell.current.clientWidth) *
          180) /
        Math.PI
      ).toFixed(2)

      diagonal.current.style.transform = `rotate(${deg}deg)`
      console.log(diagonal.current.style.transform)
    }
  }, [cell, diagonal])

  return (
    <TableHead
      ref={cell}
      className="sticky left-0 h-[55px] min-w-[180px] overflow-hidden bg-card font-bold text-card-foreground"
    >
      <div
        ref={diagonal}
        className="absolute inset-0 h-px w-[200%] origin-top-left bg-border"
      ></div>
      <div className="absolute inset-0 border-x"></div>
      <div
        className={cn(
          "absolute text-primary",
          isRoleVerticalLayout ? "right-6 top-2" : "bottom-2 left-2"
        )}
      >
        {t("Feature")}
      </div>
      <div
        className={cn(
          "absolute text-primary",
          isRoleVerticalLayout ? "bottom-2 left-6" : "right-2 top-2"
        )}
      >
        {t("Role")}
      </div>
    </TableHead>
  )
}

export default DiagonalTableCell
