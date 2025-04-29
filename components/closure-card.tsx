import { useState } from "react"
import {
  CalendarDays,
  CalendarRange,
  PencilIcon,
  Trash2Icon,
} from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { type ClosureDay } from "@/lib/types/models"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DeleteClosureDayDialog from "@/app/[locale]/management/closure-days/_components/delete-closure-day-dialog"
import MutateClosureDayDialog from "@/app/[locale]/management/closure-days/_components/mutate-closure-day-dialog"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu"

interface ClosureCardProps {
  closureDay: ClosureDay
  className?: string
  disabledContext?: boolean
  onClick?: () => void
}

export function ClosureCard({
  closureDay,
  className,
  disabledContext = false,
  onClick,
}: ClosureCardProps) {
  const isAnnual = closureDay?.year === null || closureDay?.year === undefined
  const t = useTranslations("ClosureDaysManagementPage")
  const locale = useLocale()
  const [openEdit, setOpenEdit] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  // Format the date
  const formatDate = () => {
    if (isAnnual) {
      return `${closureDay.day}/${closureDay.month} ${t("per year")}`
    } else {
      return `${closureDay.day}/${closureDay.month}/${closureDay.year}`
    }
  }

  return (
    <>
      <MutateClosureDayDialog
        type="update"
        closureDay={closureDay}
        openEdit={openEdit}
        setOpenEdit={setOpenEdit}
      />
      <DeleteClosureDayDialog
        closureDayId={closureDay.closureDayId}
        closureDayName={
          locale === "vi"
            ? closureDay.vieDescription
            : closureDay.engDescription
        }
        openDelete={openDelete}
        setOpenDelete={setOpenDelete}
      />
      <ContextMenu>
        <ContextMenuTrigger disabled={disabledContext} asChild>
          <Card
            onClick={() => {
              if (onClick) onClick()
            }}
            className={cn(
              "col-span-12 h-full flex-1 rounded-md border bg-card shadow sm:col-span-6 lg:col-span-4 xl:col-span-3",
              className
            )}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="line-clamp-2 text-lg font-medium">
                  {locale === "vi"
                    ? closureDay.vieDescription
                    : closureDay.engDescription}
                </CardTitle>
                <Badge
                  variant={isAnnual ? "progress" : "info"}
                  className="ml-2 shrink-0"
                >
                  {isAnnual ? t("Annual") : t("Fixed")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm">
                {isAnnual ? (
                  <CalendarRange className="mr-2 size-4 text-progress" />
                ) : (
                  <CalendarDays className="mr-2 size-4 text-info" />
                )}
                <span>{formatDate()}</span>
              </div>
            </CardContent>
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem
            onSelect={() => setOpenEdit(true)}
            className="flex cursor-pointer items-center gap-x-2"
          >
            <PencilIcon className="size-4" />
            {t("Edit")}
          </ContextMenuItem>
          <ContextMenuItem
            onSelect={() => setOpenDelete(true)}
            className="flex cursor-pointer items-center gap-x-2"
          >
            <Trash2Icon className="size-4" />
            {t("Delete")}
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </>
  )
}
