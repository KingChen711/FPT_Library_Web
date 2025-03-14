"use client"

import { BookOpen } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { type Shelf } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ShelfCardProps {
  shelf: Shelf
  onClick?: () => void
  selected?: boolean
}

export function ShelfCard({
  shelf: {
    shelfNumber,
    engShelfName,
    vieShelfName,
    classificationNumberRangeFrom,
    classificationNumberRangeTo,
  },
  onClick,
  selected = false,
}: ShelfCardProps) {
  const t = useTranslations("BooksManagementPage")
  const locale = useLocale()

  return (
    <Card
      onClick={() => {
        if (onClick) onClick()
      }}
      className={cn(
        "w-full max-w-80 rounded-md border-2",
        onClick && "cursor-pointer",
        selected && "border-primary"
      )}
    >
      <CardHeader className="flex flex-row items-center gap-2 border-b p-4">
        <div className="mt-1 flex size-8 items-center justify-center rounded-full bg-primary/10">
          <BookOpen className="size-4 text-primary" />
        </div>
        <CardTitle className="text-base font-bold text-primary">
          {t("Shelf")} {shelfNumber}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            <div className="text-sm font-medium text-muted-foreground">
              {t("Shelf name")}
            </div>
            <div className="font-semibold">
              {locale === "vi" ? vieShelfName : engShelfName}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <div className="text-sm font-medium text-muted-foreground">
              {t("Classification number")}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="rounded-md bg-primary/10 px-3 py-1 font-mono font-medium text-primary">
                {classificationNumberRangeFrom}
              </span>
              <span className="text-muted-foreground">{t("to")}</span>
              <span className="rounded-md bg-primary/10 px-3 py-1 font-mono font-medium text-primary">
                {classificationNumberRangeTo}
              </span>
            </div>
          </div>

          <div className="border-t pt-2">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Dewey Decimal Classification
              </div>
              <div className="rounded bg-primary/10 px-2 py-1 text-sm font-medium text-primary">
                {classificationNumberRangeFrom} - {classificationNumberRangeTo}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
